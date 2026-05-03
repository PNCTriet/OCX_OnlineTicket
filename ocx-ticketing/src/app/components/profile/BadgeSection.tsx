"use client";

import type { ProfileBadge } from "./types";
import { Medal } from "lucide-react";
import BadgeCard from "./BadgeCard";
import EmptyState from "./EmptyState";

export interface BadgeSectionProps {
  badges: ProfileBadge[];
  onBadgeDetails?: (badge: ProfileBadge) => void;
  loading?: boolean;
  className?: string;
}

export default function BadgeSection({
  badges,
  onBadgeDetails,
  loading = false,
  className = "",
}: BadgeSectionProps) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-[#262626] bg-[#141414] ${className}`}
    >
      <h2 className="border-b border-[#262626] px-4 py-3 text-lg font-semibold text-[#FAFAFA]">
        Huy hiệu / Thành tựu
      </h2>
      <div className="min-h-[180px] p-4 md:p-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl bg-[#212121]"
                aria-hidden
              />
            ))}
          </div>
        ) : badges.length === 0 ? (
          <EmptyState
            title="Chưa có huy hiệu"
            description="Tham gia sự kiện và mua vé để mở khóa huy hiệu."
            icon={Medal}
          />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none p-0 m-0">
            {badges.map((badge) => (
              <li key={badge.id}>
                <BadgeCard badge={badge} onDetails={onBadgeDetails} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
