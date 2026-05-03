import type { TicketType } from "@/app/types/ticket";

export type TicketRow = TicketType & {
  quantity: number;
  availableQty?: number;
};

type TicketCardProps = {
  ticket: TicketRow;
  onQuantityChange: (ticketId: string, change: number) => void;
  /** When false, steppers stay disabled (e.g. seatmap not selected) */
  canChangeQuantity: boolean;
};

function statusLabel(status: TicketRow["status"]) {
  if (status === "ACTIVE") return "Còn vé";
  if (status === "SOLD_OUT") return "Hết vé";
  return "Hết vé";
}

export default function TicketCard({
  ticket,
  onQuantityChange,
  canChangeQuantity,
}: TicketCardProps) {
  const maxQty = Math.min(10, ticket.availableQty ?? 0);
  const isSelected = ticket.quantity > 0;

  return (
    <div
      className={[
        "grid grid-cols-[1fr_auto] gap-2 rounded-xl border p-5 transition-colors",
        isSelected
          ? "border-[#FF6B1A] bg-[#FF6B1A]/10"
          : "border-[#262626] bg-[#141414] hover:border-[#333333]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="text-base font-semibold tracking-tight text-[#FAFAFA]">
          {ticket.name}
        </div>
        <div className="text-[13px] text-[#A1A1A1]">
          [{ticket.label || "Vé ngồi"}]{" "}
          <span
            className={
              ticket.status === "ACTIVE"
                ? "text-emerald-400"
                : ticket.status === "SOLD_OUT"
                  ? "text-red-400"
                  : "text-amber-400"
            }
          >
            {statusLabel(ticket.status)}
          </span>
          {ticket.quantity > 0 && (
            <span className="ml-1 text-[#FF6B1A]">({ticket.quantity} vé)</span>
          )}
        </div>
      </div>
      <div className="text-right text-xl font-semibold tabular-nums text-[#FAFAFA]">
        {ticket.price.toLocaleString("vi-VN")}đ
      </div>
      <div className="col-span-2 flex items-center justify-between border-t border-[#262626] pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onQuantityChange(ticket.id, -1)}
            disabled={
              ticket.quantity === 0 ||
              ticket.status === "INACTIVE" ||
              ticket.status === "SOLD_OUT" ||
              !canChangeQuantity
            }
            className="grid size-7 place-items-center rounded-md border border-[#262626] bg-[#212121] text-sm text-[#A1A1A1] transition-colors hover:text-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-5 text-center font-mono text-sm font-medium tabular-nums text-[#FAFAFA]">
            {ticket.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(ticket.id, 1)}
            disabled={
              ticket.quantity >= maxQty ||
              ticket.status === "SOLD_OUT" ||
              ticket.status === "INACTIVE" ||
              !canChangeQuantity
            }
            className="grid size-7 place-items-center rounded-md border border-[#262626] bg-[#212121] text-sm text-[#A1A1A1] transition-colors hover:text-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
        <span
          className={
            ticket.quantity > 0 ? "text-[#FF6B1A] tabular-nums" : "text-[#A1A1A1] tabular-nums"
          }
        >
          {(ticket.quantity * ticket.price).toLocaleString("vi-VN")}đ
        </span>
      </div>
    </div>
  );
}
