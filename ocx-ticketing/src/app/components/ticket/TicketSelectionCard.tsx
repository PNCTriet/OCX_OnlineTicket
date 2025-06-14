import { TicketType } from "../../types/ticket";
import { useEffect, useRef } from "react";

type TicketSelectionCardProps = {
  tickets: TicketType[];
  onQuantityChange: (ticketId: string, change: number) => void;
  highlightedTicketId: string | null;
};

export default function TicketSelectionCard({ tickets, onQuantityChange, highlightedTicketId }: TicketSelectionCardProps) {
  const ticketRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (highlightedTicketId && ticketRefs.current[highlightedTicketId]) {
      ticketRefs.current[highlightedTicketId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedTicketId]);

  return (
    <div className="bg-zinc-800/50 rounded-lg p-6 flex flex-col h-[300px]">
      <h3 className="text-lg font-semibold text-white mb-4">Chọn vé</h3>
      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4">
        {tickets.map(ticket => (
          <div 
            key={ticket.id} 
            ref={el => { ticketRefs.current[ticket.id] = el; }}
            className={`bg-zinc-900/50 rounded-lg p-4 transition-all duration-300 ${highlightedTicketId === ticket.id ? "ring-2 ring-white" : ""}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-white">{ticket.name}</span>
              <span className="text-zinc-400">{ticket.price.toLocaleString()}đ</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onQuantityChange(ticket.id, -1)}
                  disabled={ticket.quantity === 0}
                  className="w-8 h-8 rounded-full bg-zinc-700 text-white disabled:opacity-50"
                >
                  -
                </button>
                <span className="text-white w-8 text-center">{ticket.quantity}</span>
                <button
                  onClick={() => onQuantityChange(ticket.id, 1)}
                  disabled={ticket.sold >= 100}
                  className="w-8 h-8 rounded-full bg-zinc-700 text-white disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <span className="text-zinc-400">
                {(ticket.quantity * ticket.price).toLocaleString()}đ
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 