"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import OrderConfirm from "@/components/v2/OrderConfirm";
import { buildVietQrImageUrl } from "@/config/payment";

type OrderItem = {
  ticket_id: string;
  quantity: number;
  price: number;
  ticket?: { name?: string };
};
type OrderInfo = {
  id: string;
  total_amount: number;
  status: string;
  order_items?: OrderItem[];
};
type Ticket = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};
interface CouponValidationResponse {
  valid: boolean;
  discount_amount: number;
  discount_type: string;
  message?: string;
}
type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderInfo: OrderInfo;
  countdownSeconds?: number;
  selectedTickets?: Ticket[];
  finalAmount?: number;
  appliedCoupon?: CouponValidationResponse | null;
  couponCode?: string;
};

type OrderCheckResult = "paid" | "pending" | "error";

/** Chỉ dùng để hiển thị — QR / nội dung CK vẫn dùng mã đầy đủ. */
function maskOrderIdForDisplay(id: string): string {
  const s = String(id).trim();
  if (s.length <= 4) return "••••";
  if (s.length <= 8) return `${s.slice(0, 2)}•••${s.slice(-2)}`;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

export default function PaymentModal({
  isOpen,
  onClose,
  orderInfo,
  countdownSeconds,
  finalAmount,
}: PaymentModalProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [localCountdown, setLocalCountdown] = useState(countdownSeconds ?? 600);
  const [manualCheckLoading, setManualCheckLoading] = useState(false);
  const [manualFeedback, setManualFeedback] = useState<{
    tone: "info" | "warn";
    text: string;
  } | null>(null);
  const paidRef = useRef(false);

  useEffect(() => {
    if (countdownSeconds !== undefined) {
      setLocalCountdown(countdownSeconds);
    }
  }, [countdownSeconds]);

  useEffect(() => {
    if (!isOpen) return;
    paidRef.current = false;
    setIsPaid(false);
    setShowSuccessAnimation(false);
    setManualFeedback(null);
    setManualCheckLoading(false);
  }, [isOpen, orderInfo?.id]);

  useEffect(() => {
    /* Dừng đếm khi đã success — tránh re-render mỗi giây làm OrderConfirm reset */
    if (!isOpen || localCountdown <= 0 || isPaid) return;

    const timer = setInterval(() => {
      setLocalCountdown((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, localCountdown, onClose, isPaid]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /** Khi API trả PAID / poll thấy thành công */
  const triggerPaidSuccess = useCallback(() => {
    if (paidRef.current) return;
    paidRef.current = true;
    setIsPaid(true);
    setTimeout(() => setShowSuccessAnimation(true), 1000);
  }, []);

  const checkOrderStatus = useCallback(async (): Promise<OrderCheckResult> => {
    if (!orderInfo?.id) return "error";
    if (paidRef.current) return "paid";
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken || !API_BASE_URL) return "error";

      const res = await fetch(`${API_BASE_URL}/orders/${orderInfo.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) return "error";
      const data = await res.json();
      if (data.status === "PAID" || data.status === "SUCCESS") {
        triggerPaidSuccess();
        return "paid";
      }
      return "pending";
    } catch {
      return "error";
    }
  }, [orderInfo?.id, triggerPaidSuccess]);

  const handlePaidButtonClick = useCallback(async () => {
    setManualFeedback(null);

    setManualCheckLoading(true);
    try {
      const result = await checkOrderStatus();
      if (result === "paid") {
        return;
      }
      if (result === "pending") {
        setManualFeedback({
          tone: "info",
          text:
            "Chưa ghi nhận thanh toán. Sau khi chuyển đúng số tiền và nội dung (không sửa), ngân hàng thường cập nhật trong vài phút. Bạn có thể bấm lại sau hoặc đợi hệ thống tự xác nhận.",
        });
        return;
      }
      setManualFeedback({
        tone: "warn",
        text:
          "Không kiểm tra được trạng thái lúc này. Vui lòng thử lại hoặc đợi thông báo tự động khi tiền về.",
      });
    } finally {
      setManualCheckLoading(false);
    }
  }, [checkOrderStatus]);

  const handleCloseSuccessOverlay = useCallback(() => {
    setShowSuccessAnimation(false);
  }, []);

  useEffect(() => {
    if (!isOpen || !orderInfo?.id || isPaid) return;
    let interval: NodeJS.Timeout | null = null;

    const tick = async () => {
      await checkOrderStatus(); /* kết quả pending/paid — poll chỉ cần paid path */
    };

    interval = setInterval(tick, 3000);
    tick();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, orderInfo?.id, isPaid, checkOrderStatus]);

  if (!isOpen || !orderInfo) return null;

  const paymentAmount = finalAmount ?? orderInfo.total_amount;
  const qrUrl = buildVietQrImageUrl(paymentAmount, `OCX${orderInfo.id}`);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />
        <div
          className="relative w-full max-w-md rounded-2xl border border-[#262626] bg-[#141414] p-6 text-center shadow-2xl md:p-8"
          role="dialog"
          aria-labelledby="payment-modal-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-[#737373] transition hover:bg-[#262626] hover:text-[#FAFAFA] md:right-6 md:top-6"
            aria-label="Đóng"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2
            id="payment-modal-title"
            className="px-10 text-xl font-semibold tracking-tight text-[#FAFAFA] md:text-2xl"
          >
            Quét để thanh toán
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#A1A1A1]">
            Mở app ngân hàng và quét mã QR.
          </p>

          <div className="relative mx-auto mt-6 aspect-square w-full max-w-[260px] rounded-xl border border-[#262626] bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
            <div className="absolute inset-4">
              <Image
                src={qrUrl}
                alt="Mã QR chuyển khoản"
                fill
                className="object-contain"
                sizes="260px"
                priority
                unoptimized
              />
            </div>
          </div>

          <p className="mt-5 font-mono text-lg font-semibold tabular-nums text-[#FAFAFA]">
            {Number(paymentAmount).toLocaleString("vi-VN")}₫
          </p>
          <p className="mt-1 text-xs text-[#737373]">
            Mã đơn · OCX{maskOrderIdForDisplay(orderInfo.id)}
          </p>

          <div className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-2 rounded-lg border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-3 py-2.5 text-center">
            <span
              className="size-1.5 shrink-0 animate-pulse rounded-full bg-[#FBBF24]"
              aria-hidden
            />
            <span className="text-sm font-medium text-[#FBBF24]">
              Đang chờ thanh toán · {formatCountdown(localCountdown)}
            </span>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[#737373]">
            Vui lòng không thay đổi nội dung chuyển khoản.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#262626] bg-transparent py-3 text-sm font-semibold text-[#FAFAFA] transition hover:bg-[#262626]"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={() => void handlePaidButtonClick()}
              disabled={manualCheckLoading || isPaid}
              className="flex-1 rounded-xl bg-[#FF6B1A] py-3 text-sm font-semibold text-white transition hover:bg-[#e55f15] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {manualCheckLoading ? "Đang kiểm tra…" : "Đã chuyển khoản"}
            </button>
          </div>

          {manualFeedback && !isPaid && (
            <p
              role="status"
              className={[
                "mt-4 text-center text-xs leading-relaxed",
                manualFeedback.tone === "warn"
                  ? "text-[#F87171]"
                  : "text-[#A1A1A1]",
              ].join(" ")}
            >
              {manualFeedback.text}
            </p>
          )}

          {isPaid && (
            <p className="mt-4 text-center text-sm font-medium text-[#34D399]">
              Đang xác nhận giao dịch…
            </p>
          )}
        </div>
      </div>

      {showSuccessAnimation && (
        <OrderConfirm
          isOpen={showSuccessAnimation}
          onClose={handleCloseSuccessOverlay}
        />
      )}
    </>
  );
}
