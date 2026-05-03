"use client";
import { Ticket } from "../../types/ticket";

interface CouponValidationResponse {
  valid: boolean;
  discount_amount: number;
  discount_type: string;
  message?: string;
}

type OrderSummaryCardProps = {
  totalAmount: number;
  finalAmount?: number;
  appliedCoupon?: CouponValidationResponse | null;
  onContinue: () => void;
  hasTickets: boolean;
  selectedTickets: Ticket[];
};

export default function OrderSummaryCard({ 
  totalAmount, 
  finalAmount, 
  appliedCoupon, 
  onContinue, 
  hasTickets, 
  selectedTickets 
}: OrderSummaryCardProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[#262626] bg-[#0F0F0F] p-6">
      <h3 className="text-base font-semibold text-[#FAFAFA]">Tóm tắt</h3>
      <div className="mt-4 space-y-4">
        {selectedTickets.map((ticket) => (
          ticket.quantity > 0 && (
            <div key={ticket.id} className="rounded-lg border border-[#262626] bg-[#141414] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#FAFAFA]">{ticket.name}</p>
                  <p className="text-sm text-[#A1A1A1]">Số lượng: {ticket.quantity}</p>
                </div>
                <p className="shrink-0 font-mono text-sm font-medium text-[#FAFAFA]">
                  {(ticket.price * ticket.quantity).toLocaleString()}đ
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {ticket.status === "ACTIVE" && (
                  <span className="rounded-full border border-transparent bg-[#34D39914] px-2 py-1 text-xs font-medium text-[#34D399]">
                    Còn vé
                  </span>
                )}
                {ticket.status === "INACTIVE" && (
                  <span className="rounded-full border border-transparent bg-[#FBBF2414] px-2 py-1 text-xs font-medium text-[#FBBF24]">
                    Chưa mở bán
                  </span>
                )}
                {ticket.status === "SOLD_OUT" && (
                  <span className="rounded-full border border-transparent bg-[#F8717114] px-2 py-1 text-xs font-medium text-[#F87171]">
                    Hết vé
                  </span>
                )}
              </div>
            </div>
          )
        ))}
        <div className="space-y-2 border-t border-[#262626] pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#A1A1A1]">Tạm tính</span>
            <span className="font-mono text-sm text-[#FAFAFA]">{totalAmount.toLocaleString()}đ</span>
          </div>

          {appliedCoupon && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#34D399]">Giảm giá</span>
              <span className="font-mono text-sm text-[#34D399]">
                -{appliedCoupon.discount_amount.toLocaleString()}đ
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-[#262626] pt-3">
            <span className="text-xs font-medium uppercase tracking-wide text-[#A1A1A1]">
              Tổng cộng
            </span>
            <span className="font-mono text-2xl font-medium tracking-tight text-[#FF6B1A]">
              {(finalAmount || totalAmount).toLocaleString()}đ
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onContinue}
        disabled={!hasTickets}
        className="mt-6 flex w-full min-h-12 items-center justify-center rounded-xl bg-[#FF6B1A] py-3 text-base font-semibold text-white transition hover:bg-[#e55f15] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Tiếp tục thanh toán
      </button>
      <p className="mt-2 text-center text-xs text-[#737373]">
        Nhấn tiếp tục để nhập thông tin thanh toán.
      </p>
    </div>
  );
} 