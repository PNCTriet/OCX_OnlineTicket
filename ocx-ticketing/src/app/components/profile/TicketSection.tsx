"use client";

import { useState } from "react";
import type { ProfileTicket, TicketStatusTab } from "./types";
import { Ticket as TicketIcon } from "lucide-react";
import TicketCard from "./TicketCard";
import EmptyState from "./EmptyState";

export interface TicketSectionProps {
  tickets: ProfileTicket[];
  onViewDetails?: (ticket: ProfileTicket) => void;
  loading?: boolean;
  className?: string;
}

const TABS: { id: TicketStatusTab; label: string }[] = [
  { id: "upcoming", label: "Sắp diễn ra" },
  { id: "used", label: "Đã sử dụng" },
  { id: "expired", label: "Hết hạn" },
];

export default function TicketSection({
  tickets,
  onViewDetails,
  loading = false,
  className = "",
}: TicketSectionProps) {
  const [activeTab, setActiveTab] = useState<TicketStatusTab>("upcoming");

  const filtered = tickets.filter((t) => t.status === activeTab);

  return (
    <section
      className={`overflow-hidden rounded-xl border border-[#262626] bg-[#141414] ${className}`}
    >
      <h2 className="sr-only">Vé của tôi</h2>
      <div className="flex border-b border-[#262626]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-[#FF6B1A] bg-[#212121] text-[#FAFAFA]"
                : "text-[#A1A1A1] hover:text-[#FAFAFA]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[200px] p-4 md:p-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl bg-[#212121]"
                aria-hidden
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Chưa có vé"
            description={
              activeTab === "upcoming"
                ? "Bạn chưa có vé sắp diễn ra. Khám phá sự kiện và mua vé ngay."
                : activeTab === "used"
                  ? "Chưa có vé đã sử dụng."
                  : "Chưa có vé hết hạn."
            }
            ctaLabel={activeTab === "upcoming" ? "Khám phá sự kiện" : undefined}
            ctaHref={activeTab === "upcoming" ? "/ticket" : undefined}
            icon={TicketIcon}
          />
        ) : (
          <ul className="space-y-4 list-none p-0 m-0">
            {filtered.map((ticket) => (
              <li key={ticket.id}>
                <TicketCard ticket={ticket} onViewDetails={onViewDetails} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
