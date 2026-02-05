"use client";

import type { ProfileBadge } from "./types";
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
      className={`rounded-xl border border-white/10 bg-black/20 overflow-hidden ${className}`}
    >
      <h2 className="px-4 py-3 text-lg font-semibold text-white border-b border-white/10">
        Huy hiệu / Thành tựu
      </h2>
      <div className="p-4 md:p-5 min-h-[180px]">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-white/5 animate-pulse"
                aria-hidden
              />
            ))}
          </div>
        ) : badges.length === 0 ? (
          <EmptyState
            title="Chưa có huy hiệu"
            description="Tham gia sự kiện và mua vé để mở khóa huy hiệu."
            iconLabel="🏅"
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
