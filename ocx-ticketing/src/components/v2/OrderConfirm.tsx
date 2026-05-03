"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type OrderConfirmProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * V2 payment success overlay. Props and side effects match
 * `app/components/checkout/PaymentSuccessModal` (timers + redirect) for Phase 2 swap.
 */
export default function OrderConfirm({ isOpen, onClose }: OrderConfirmProps) {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();
  /** Tránh đưa `onClose` vào deps — parent hay gây identity mới mỗi render → loop reset timer */
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    setShowCheckmark(false);
    setShowMessage(false);

    const timer1 = setTimeout(() => {
      setShowCheckmark(true);
    }, 300);
    const timer2 = setTimeout(() => {
      setShowMessage(true);
    }, 800);
    const timer3 = setTimeout(() => {
      onCloseRef.current();
      router.push("/profile");
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-[#34D399]/25 bg-[#141414] p-8 shadow-2xl ring-1 ring-[#262626]">
        <div className="flex flex-col items-center space-y-6">
          <div
            className={[
              "flex size-20 items-center justify-center rounded-full border-4 border-[#34D399] transition-all duration-500",
              showCheckmark ? "scale-100 opacity-100" : "scale-0 opacity-0",
            ].join(" ")}
          >
            <svg
              className={[
                "size-10 text-[#34D399] transition-all duration-300",
                showCheckmark ? "scale-100 opacity-100" : "scale-0 opacity-0",
              ].join(" ")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div
            className={[
              "text-center transition-all duration-500",
              showMessage ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            ].join(" ")}
          >
            <h2 className="mb-2 text-2xl font-semibold text-[#FAFAFA]">
              Thanh toán thành công!
            </h2>
            <p className="text-sm leading-relaxed text-[#A1A1A1]">
              Email xác nhận sẽ được gửi đến bạn trong thời gian sớm nhất. Vé điện tử
              sẽ được gửi về email của bạn.
            </p>
          </div>

          <div
            className={[
              "flex space-x-1 transition-all duration-500",
              showMessage ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            <div
              className="size-2 animate-bounce rounded-full bg-[#34D399]"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="size-2 animate-bounce rounded-full bg-[#34D399]"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="size-2 animate-bounce rounded-full bg-[#34D399]"
              style={{ animationDelay: "300ms" }}
            />
          </div>

          <div
            className={[
              "text-center transition-all duration-500",
              showMessage ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            <p className="text-xs text-[#737373]">
              Tự động chuyển về trang hồ sơ trong vài giây...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
