import { TicketType } from "../../types/ticket";
import { useRef } from "react";

type TicketSelectionCardProps = {
  tickets: (TicketType & { quantity: number; availableQty?: number })[];
  onQuantityChange: (ticketId: string, change: number) => void;
  selectedZoneId?: string | null;
  /**
   * Some pages require picking a seatmap zone before enabling +/-.
   * @default true
   */
  requireSeatmapSelection?: boolean;
};

export default function TicketSelectionCard({
  tickets,
  onQuantityChange,
  selectedZoneId,
  requireSeatmapSelection = true,
}: TicketSelectionCardProps) {
  const ticketRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Use selectedZoneId to determine if seatmap selections are ACTIVE
  const hasSeatmapSelections = requireSeatmapSelection ? selectedZoneId !== null : true;

  return (
    <div className="rounded-lg p-6 flex flex-col min-h-0 h-full bg-black/25 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Chọn vé</h3>
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar space-y-4">
        {tickets.map(ticket => (
          <div 
            key={ticket.id} 
            ref={el => { ticketRefs.current[ticket.id] = el; }}
            className={`rounded-lg p-4 transition-all duration-300 bg-black/25 border ${
              ticket.quantity > 0 ? "border-[#d43922]" : "border-white/10"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium text-white">{ticket.name}</span>
                <span className="ml-2 text-sm text-white/70">[{ticket.label || "Vé ngồi"}]</span>
                <span 
                  className={`ml-2 text-xs font-semibold ${ticket.status === 'ACTIVE' ? 'text-green-500' : ticket.status === 'SOLD_OUT' ? 'text-red-500' : 'text-yellow-500'}`}
                >
                  {ticket.status === 'ACTIVE' ? 'Còn vé' : ticket.status === 'SOLD_OUT' ? 'Hết vé' : 'Hết vé'}
                </span>
                {ticket.quantity > 0 && (
                  <span className="ml-2 text-sm text-[#d43922]">({ticket.quantity} vé)</span>
                )}
              </div>
              <span className="text-white/70">{ticket.price.toLocaleString()}đ</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onQuantityChange(ticket.id, -1)}
                  disabled={
                    ticket.quantity === 0 || 
                    ticket.status === 'INACTIVE' || 
                    ticket.status === 'SOLD_OUT' ||
                    !hasSeatmapSelections
                  }
                  className="w-10 h-10 rounded-full bg-white/10 text-white disabled:opacity-40 hover:bg-white/15 transition-colors flex items-center justify-center text-xl"
                >
                  -
                </button>
                <span className="text-white w-8 text-center text-lg">{ticket.quantity}</span>
                <button
                  onClick={() => onQuantityChange(ticket.id, 1)}
                  disabled={
                    ticket.quantity >= Math.min(10, ticket.availableQty || 0) ||
                    ticket.status === 'SOLD_OUT' || 
                    ticket.status === 'INACTIVE' ||
                    !hasSeatmapSelections
                  }
                  className="w-10 h-10 rounded-full bg-white/10 text-white disabled:opacity-40 hover:bg-white/15 transition-colors flex items-center justify-center text-xl"
                >
                  +
                </button>
              </div>
              <span className={`${ticket.quantity > 0 ? "text-[#d43922]" : "text-white/60"}`}>
                {(ticket.quantity * ticket.price).toLocaleString()}đ
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 