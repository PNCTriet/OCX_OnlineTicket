import type { TicketType } from "@/app/types/ticket";
import TicketCard from "./TicketCard";

type TicketListProps = {
  tickets: (TicketType & { quantity: number; availableQty?: number })[];
  onQuantityChange: (ticketId: string, change: number) => void;
  selectedZoneId?: string | null;
  /**
   * Some pages require picking a seatmap zone before enabling +/-.
   * @default true
   */
  requireSeatmapSelection?: boolean;
};

/**
 * V2 shell for the ticket quantity list. Props align with
 * `app/components/ticket/TicketSelectionCard` for a drop-in swap in Phase 2.
 */
export default function TicketList({
  tickets,
  onQuantityChange,
  selectedZoneId,
  requireSeatmapSelection = true,
}: TicketListProps) {
  const hasSeatmapSelections = requireSeatmapSelection
    ? selectedZoneId !== null
    : true;

  return (
    <div className="flex min-h-0 flex-col rounded-xl border border-[#262626] bg-[#0F0F0F] p-6">
      <h3 className="mb-4 text-base font-semibold text-[#FAFAFA]">Chọn vé</h3>
      <div className="hide-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-0.5">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onQuantityChange={onQuantityChange}
            canChangeQuantity={hasSeatmapSelections}
          />
        ))}
      </div>
    </div>
  );
}
