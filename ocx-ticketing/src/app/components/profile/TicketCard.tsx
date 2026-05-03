"use client";

import { Calendar, MapPin } from "lucide-react";
import { OnyxIcon } from "@/components/ui/OnyxIcon";
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
      ? "Đã xác nhận"
      : ticket.status === "used"
        ? "Đã sử dụng"
        : "Hết hạn";

  const orderRef = `#ONX-${ticket.id.toUpperCase().replace(/[^A-Z0-9]/gi, "").slice(0, 8) || "TICKET"}`;

  return (
    <article
      className={`grid grid-cols-1 items-center gap-6 rounded-xl border border-[#262626] bg-[#141414] p-5 md:grid-cols-[1fr_96px] ${isDisabled ? "opacity-80" : ""} ${className}`}
    >
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {ticket.status === "upcoming" && (
            <span className="rounded-full border border-transparent bg-[#34D39914] px-2 py-0.5 text-xs font-medium text-[#34D399]">
              {statusLabel}
            </span>
          )}
          {ticket.status !== "upcoming" && (
            <span className="rounded-full border border-[#262626] bg-[#212121] px-2 py-0.5 text-xs font-medium text-[#A1A1A1]">
              {statusLabel}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-[#FAFAFA] line-clamp-2">
          {ticket.eventName}
        </h3>
        <div className="flex flex-col gap-1.5 text-sm text-[#A1A1A1]">
          <span className="inline-flex items-center gap-2">
            <OnyxIcon icon={Calendar} size={16} className="shrink-0 text-[#737373]" />
            {ticket.date} · {ticket.time}
          </span>
          <span className="inline-flex items-center gap-2 truncate" title={ticket.venue}>
            <OnyxIcon icon={MapPin} size={16} className="shrink-0 text-[#737373]" />
            {ticket.venue}
          </span>
          <span className="font-mono text-xs text-[#737373]">{orderRef}</span>
        </div>
        {ticket.transferable && ticket.status === "upcoming" && (
          <p className="text-xs text-[#737373]">Có thể chuyển vé (sắp có)</p>
        )}
        {!isDisabled && (
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onViewDetails?.(ticket)}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#262626] bg-[#212121] px-4 text-sm font-medium text-[#FAFAFA] transition-colors hover:bg-[#262626]"
            >
              Xem vé
            </button>
            <button
              type="button"
              disabled
              className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-lg border border-dashed border-[#333333] px-4 text-sm font-medium text-[#525252]"
            >
              Tải PDF
            </button>
          </div>
        )}
      </div>
      <div
        className="mx-auto flex size-24 shrink-0 items-center justify-center rounded-lg border border-[#262626] bg-[#0A0A0A] p-1.5 md:size-[96px]"
        aria-hidden
      >
        <div
          className="size-full rounded-md opacity-90"
          style={{
            background:
              "repeating-conic-gradient(#FAFAFA 0 25%, #0A0A0A 0 50%) 0 0 / 8px 8px",
          }}
        />
      </div>
    </article>
  );
}
