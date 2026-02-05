"use client";

import { useState } from "react";
import type { ProfileTicket, TicketStatusTab } from "./types";
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
      className={`rounded-xl border border-white/10 bg-black/20 overflow-hidden ${className}`}
    >
      <h2 className="sr-only">Vé của tôi</h2>
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-white border-b-2 border-red-500 bg-white/5"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-5 min-h-[200px]">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-white/5 animate-pulse"
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
            ctaHref={activeTab === "upcoming" ? "/OCX5" : undefined}
            iconLabel="🎟️"
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
