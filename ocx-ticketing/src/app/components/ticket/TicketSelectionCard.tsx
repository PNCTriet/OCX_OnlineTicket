import { TicketType } from "../../types/ticket";
import { useRef } from "react";

type TicketSelectionCardProps = {
  tickets: TicketType[];
  onQuantityChange: (ticketId: string, change: number) => void;
};

export default function TicketSelectionCard({ tickets, onQuantityChange }: TicketSelectionCardProps) {
  const ticketRefs = useRef<Record<string, HTMLDivElement | null>>({});

  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-[300px]">
      <h3 className="text-lg font-semibold text-white mb-4">Chọn vé</h3>
      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4">
        {tickets.map(ticket => (
          <div 
            key={ticket.id} 
            ref={el => { ticketRefs.current[ticket.id] = el; }}
            className={`bg-zinc-900/50 rounded-lg p-4 transition-all duration-300 ${
              ticket.quantity > 0 ? "border-2 border-[#c53e00]" : ""}`}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium text-white">{ticket.name}</span>
                <span className="ml-2 text-sm text-zinc-400">[{ticket.label || "Khu vực tiêu chuẩn"}]</span>
                {ticket.quantity > 0 && (
                  <span className="ml-2 text-sm text-[#c53e00]">({ticket.quantity} vé)</span>
                )}
              </div>
              <span className="text-zinc-400">{ticket.price.toLocaleString()}đ</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onQuantityChange(ticket.id, -1)}
                  disabled={ticket.quantity === 0}
                  className="w-10 h-10 rounded-full bg-zinc-700 text-white disabled:opacity-50 hover:bg-zinc-600 transition-colors flex items-center justify-center text-xl"
                >
                  -
                </button>
                <span className="text-white w-8 text-center text-lg">{ticket.quantity}</span>
                <button
                  onClick={() => onQuantityChange(ticket.id, 1)}
                  disabled={ticket.sold >= 100}
                  className="w-10 h-10 rounded-full bg-zinc-700 text-white disabled:opacity-50 hover:bg-zinc-600 transition-colors flex items-center justify-center text-xl"
                >
                  +
                </button>
              </div>
              <span className={`${ticket.quantity > 0 ? "text-[#c53e00]" : "text-zinc-400"}`}>
                {(ticket.quantity * ticket.price).toLocaleString()}đ
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 