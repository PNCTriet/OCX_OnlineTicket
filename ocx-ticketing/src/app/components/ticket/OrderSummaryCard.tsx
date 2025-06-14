"use client";

type OrderSummaryCardProps = {
  totalAmount: number;
  onContinue: () => void;
};

export default function OrderSummaryCard({ totalAmount, onContinue }: OrderSummaryCardProps) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-zinc-400">Tạm tính:</span>
        <span className="text-xl font-bold text-white">{totalAmount.toLocaleString()}đ</span>
      </div>
      <button
        onClick={onContinue}
        disabled={totalAmount === 0}
        className="w-full py-3 rounded-lg bg-white text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        Tiếp tục
      </button>
    </div>
  );
} 