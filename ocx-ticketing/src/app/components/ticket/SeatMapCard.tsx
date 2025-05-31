"use client";

const SEATS = [
  // Mock 5x5 grid, mỗi ghế có id, type, status
  ...Array(5).fill(0).flatMap((_, row) =>
    Array(5).fill(0).map((_, col) => {
      const id = row * 5 + col + 1;
      let type = "STANDARD";
      if (row === 0) type = "VVIP";
      else if (row === 1) type = "VIP";
      else if (row === 2) type = "PREMIUM";
      else if (row === 3) type = "MUSIC LOVER";
      return { id, type, status: "available" };
    })
  )
];

const TYPE_COLOR: Record<string, string> = {
  VVIP: "bg-fuchsia-600",
  VIP: "bg-green-500",
  PREMIUM: "bg-yellow-400",
  STANDARD: "bg-zinc-700",
  "MUSIC LOVER": "bg-blue-500",
};

export default function SeatMapCard({ selected, setSelected }: { selected: number[]; setSelected: (ids: number[]) => void }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-4 w-full">
      <div className="font-bold text-white mb-2">Seat Map</div>
      <div className="grid grid-cols-5 gap-3 justify-center">
        {SEATS.map(seat => (
          <button
            key={seat.id}
            disabled={seat.status !== "available"}
            onClick={() => setSelected(selected.includes(seat.id) ? selected.filter(i => i !== seat.id) : [...selected, seat.id])}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow transition-all
              ${TYPE_COLOR[seat.type]} 
              ${selected.includes(seat.id) ? "ring-2 ring-white scale-110" : "opacity-80 hover:opacity-100"}
              ${seat.status !== "available" ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
            title={seat.type}
          >
            {seat.id}
          </button>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap mt-2 text-xs">
        {Object.entries(TYPE_COLOR).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <span className={`inline-block w-4 h-4 rounded-full ${color}`}></span>
            <span className="text-white/70">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 