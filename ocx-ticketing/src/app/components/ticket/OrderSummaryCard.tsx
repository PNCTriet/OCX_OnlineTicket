"use client";
import { Ticket } from "../../types/ticket";

type OrderSummaryCardProps = {
  totalAmount: number;
  onContinue: () => void;
  hasTickets: boolean;
  selectedTickets: Ticket[];
};

export default function OrderSummaryCard({ totalAmount, onContinue, hasTickets, selectedTickets }: OrderSummaryCardProps) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-full">
      <div className="space-y-4 mb-4">
        {selectedTickets.map((ticket) => (
          ticket.quantity > 0 && (
            <div key={ticket.id} className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{ticket.name}</p>
                <p className="text-zinc-400 text-sm">Số lượng: {ticket.quantity}</p>
              </div>
              <p className="text-white font-medium">{(ticket.price * ticket.quantity).toLocaleString()}đ</p>
            </div>
          )
        ))}
        <div className="border-t border-zinc-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Tạm tính:</span>
            <span className="text-xl font-bold text-white">{totalAmount.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
      <button
        onClick={onContinue}
        disabled={!hasTickets}
        className="w-full py-3 px-4 bg-[#c53e00] text-white rounded-lg font-medium hover:bg-[#b33800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Tiếp tục
      </button>
      <p className="mt-2 text-xs text-zinc-400 italic text-center">
        Nhấn tiếp tục để nhập thông tin thanh toán.
      </p>
    </div>
  );
} 