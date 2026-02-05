"use client";

import type { ProfileTicket } from "./types";

export interface TicketCardProps {
  ticket: ProfileTicket;
  onViewDetails?: (ticket: ProfileTicket) => void;
  className?: string;
}

export default function TicketCard({
  ticket,
  onViewDetails,
  className = "",
}: TicketCardProps) {
  const isDisabled = ticket.disabled ?? ticket.status !== "upcoming";
  const statusLabel =
    ticket.status === "upcoming"
      ? "Sắp diễn ra"
      : ticket.status === "used"
        ? "Đã sử dụng"
        : "Hết hạn";

  return (
    <article
      className={`rounded-xl border border-white/10 bg-black/30 p-4 md:p-5 transition-colors ${
        isDisabled ? "opacity-75" : "hover:border-white/20"
      } ${className}`}
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-white/95 line-clamp-2">
          {ticket.eventName}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
          <span>{ticket.date}</span>
          <span>{ticket.time}</span>
          <span className="w-full md:w-auto truncate" title={ticket.venue}>
            {ticket.venue}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              ticket.status === "upcoming"
                ? "bg-emerald-500/20 text-emerald-300"
                : ticket.status === "used"
                  ? "bg-slate-500/20 text-slate-300"
                  : "bg-red-500/20 text-red-300"
            }`}
          >
            {statusLabel}
          </span>
          {ticket.transferable && ticket.status === "upcoming" && (
            <span className="text-xs text-white/50">Có thể chuyển</span>
          )}
        </div>
        {!isDisabled && (onViewDetails || true) && (
          <button
            type="button"
            onClick={() => onViewDetails?.(ticket)}
            disabled={isDisabled}
            className="mt-2 w-full md:w-auto rounded-full px-4 py-2 text-sm font-semibold text-white border border-white/50 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            style={{
              background: "linear-gradient(180deg, #d43922 0%, #9a1a15 100%)",
            }}
          >
            Xem chi tiết
          </button>
        )}
      </div>
    </article>
  );
}
