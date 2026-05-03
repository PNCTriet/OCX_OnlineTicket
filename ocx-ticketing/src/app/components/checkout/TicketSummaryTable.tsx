"use client";
import { Clock } from "lucide-react";
import { Ticket } from "../../types/ticket";
import { EVENT_INFO } from "../../constants/ticket";

interface CouponValidationResponse {
  valid: boolean;
  discount_amount: number;
  discount_type: string;
  message?: string;
}

type TicketSummaryTableProps = {
  selectedTickets: (Ticket & { quantity: number })[];
  totalAmount: number;
  finalAmount?: number;
  appliedCoupon?: CouponValidationResponse | null;
  /** Mặc định dùng `EVENT_INFO.name` */
  eventName?: string;
};

/** Bám Onyx — khối order-summary (Ticketing Platform.html) */
export default function TicketSummaryTable({
  selectedTickets,
  totalAmount,
  finalAmount,
  appliedCoupon,
  eventName,
}: TicketSummaryTableProps) {
  const pay = finalAmount ?? totalAmount;
  const title = eventName ?? EVENT_INFO.name;

  return (
    <div className="rounded-xl border border-[#262626] bg-[#141414] p-6">
      <h3 className="text-lg font-semibold tracking-tight text-[#FAFAFA]">
        Tóm tắt đơn hàng
      </h3>
      <p className="mt-1 text-[13px] text-[#A1A1A1]">{title}</p>
      <div className="my-4 h-px bg-[#262626]" />

      <div className="space-y-3">
        {selectedTickets
          .filter((t) => t.quantity > 0)
          .map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-start justify-between gap-4 text-[15px]"
            >
              <span className="text-[#A1A1A1]">
                {ticket.name}{" "}
                <span className="text-[#737373]">×{ticket.quantity}</span>
              </span>
              <span className="shrink-0 font-medium tabular-nums text-[#FAFAFA]">
                {(ticket.price * ticket.quantity).toLocaleString("vi-VN")}₫
              </span>
            </div>
          ))}
      </div>

      <div className="my-4 h-px bg-[#262626]" />

      <div className="space-y-2 text-[15px]">
        <div className="flex justify-between text-[#A1A1A1]">
          <span>Tạm tính</span>
          <span className="tabular-nums text-[#FAFAFA]">
            {totalAmount.toLocaleString("vi-VN")}₫
          </span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-[#34D399]">
            <span>Giảm giá</span>
            <span className="tabular-nums">
              −{appliedCoupon.discount_amount.toLocaleString("vi-VN")}₫
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-[#262626] pt-4">
        <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
          Tổng cộng
        </span>
        <span className="font-mono text-2xl font-medium tabular-nums tracking-tight text-[#FF6B1A]">
          {pay.toLocaleString("vi-VN")}₫
        </span>
      </div>

      <p className="mt-4 flex items-center gap-2 text-[13px] text-[#FBBF24]">
        <Clock
          className="size-4 shrink-0 text-[#FBBF24]"
          strokeWidth={1.75}
          aria-hidden
        />
        Hoàn tất thanh toán trong phiên để giữ vé.
      </p>
    </div>
  );
}
