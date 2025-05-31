"use client";
export default function OrderSummaryCard({ selectedSeats, onConfirm, disabled, agreed, setAgreed }: {
  selectedSeats: number[];
  onConfirm: () => void;
  disabled: boolean;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
}) {
  // Mock seat info
  const seatType = (id: number) => {
    if (id <= 5) return { type: "VVIP", price: 1200000 };
    if (id <= 10) return { type: "VIP", price: 900000 };
    if (id <= 15) return { type: "PREMIUM", price: 700000 };
    if (id <= 20) return { type: "MUSIC LOVER", price: 500000 };
    return { type: "STANDARD", price: 300000 };
  };
  const seats = selectedSeats.map(id => ({ id, ...seatType(id) }));
  const total = seats.reduce((sum, s) => sum + s.price, 0);
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-3 w-full max-w-md mx-auto">
      <div className="font-bold text-white mb-2">Order Summary</div>
      <div className="flex flex-wrap gap-2">
        {seats.map(s => (
          <div key={s.id} className="px-2 py-1 rounded bg-zinc-800 text-xs text-white border border-zinc-700">
            Seat #{s.id} <span className="ml-1 font-bold text-purple-400">{s.type}</span>
          </div>
        ))}
      </div>
      <div className="text-white/80 text-sm mt-2">Total: <span className="text-green-400 font-bold">{total.toLocaleString()}₫</span></div>
      <label className="flex items-center gap-2 mt-2 text-xs text-white/70">
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        I agree to the ticket purchase policy
      </label>
      <button
        className="mt-2 px-4 py-2 rounded bg-purple-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled || !agreed || seats.length === 0}
        onClick={onConfirm}
      >
        Confirm Payment
      </button>
    </div>
  );
} 