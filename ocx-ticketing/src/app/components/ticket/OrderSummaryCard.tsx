"use client";

type OrderSummaryCardProps = {
  totalAmount: number;
  onContinue: () => void;
  hasTickets: boolean;
};

export default function OrderSummaryCard({ totalAmount, onContinue, hasTickets }: OrderSummaryCardProps) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-zinc-400">Tạm tính:</span>
        <span className="text-xl font-bold text-white">{totalAmount.toLocaleString()}đ</span>
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