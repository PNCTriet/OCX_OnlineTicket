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
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-full">
      <div className="space-y-4 mb-4">
        {selectedTickets.map((ticket) => (
          ticket.quantity > 0 && (
            <div key={ticket.id} className="border border-zinc-700/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-white font-medium">{ticket.name}</p>
                  <p className="text-zinc-400 text-sm">Số lượng: {ticket.quantity}</p>
                </div>
                <p className="text-white font-medium">{(ticket.price * ticket.quantity).toLocaleString()}đ</p>
              </div>
              <div className="flex items-center gap-2">
                {ticket.status === 'ACTIVE' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    Còn vé
                  </span>
                )}
                {ticket.status === 'INACTIVE' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    Chưa mở bán
                  </span>
                )}
                {ticket.status === 'SOLD_OUT' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                    Hết vé
                  </span>
                )}
              </div>
            </div>
          )
        ))}
        <div className="border-t border-zinc-700 pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Tạm tính:</span>
            <span className="text-white">{totalAmount.toLocaleString()}đ</span>
          </div>
          
          {appliedCoupon && (
            <div className="flex justify-between items-center">
              <span className="text-green-400">Giảm giá:</span>
              <span className="text-green-400">-{appliedCoupon.discount_amount.toLocaleString()}đ</span>
            </div>
          )}
          
          <div className="flex justify-between items-center border-t border-zinc-600 pt-2">
            <span className="text-zinc-400 font-medium">Tổng cộng:</span>
            <span className="text-xl font-bold text-white">
              {(finalAmount || totalAmount).toLocaleString()}đ
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onContinue}
        disabled={!hasTickets}
        className="w-full py-3 px-4 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_18px_rgba(212,57,34,0.35)] active:scale-95"
        style={{
          background: hasTickets
            ? "linear-gradient(180deg, #d43922 0%, #9a1a15 100%)"
            : "rgba(255,255,255,0.12)",
        }}
      >
        Tiếp tục
      </button>
      <p className="mt-2 text-xs text-zinc-400 italic text-center">
        Nhấn tiếp tục để nhập thông tin thanh toán.
      </p>
    </div>
  );
} 