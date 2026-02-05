"use client";

import type { ProfileBadge } from "./types";

export interface BadgeCardProps {
  badge: ProfileBadge;
  onDetails?: (badge: ProfileBadge) => void;
  className?: string;
}

const RARITY_CLASS: Record<string, string> = {
  common: "border-white/20 text-white/70",
  rare: "border-blue-400/40 text-blue-300/90",
  epic: "border-purple-400/40 text-purple-300/90",
  legendary: "border-amber-400/50 text-amber-300/95",
};

export default function BadgeCard({
  badge,
  onDetails,
  className = "",
}: BadgeCardProps) {
  const rarityClass = badge.rarity ? RARITY_CLASS[badge.rarity] ?? RARITY_CLASS.common : "border-white/20 text-white/70";

  return (
    <article
      className={`rounded-xl border bg-black/30 p-4 transition-colors ${
        badge.unlocked ? rarityClass : "border-white/10 opacity-60"
      } ${className}`}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            badge.unlocked ? "bg-white/10" : "bg-white/5 grayscale"
          }`}
          aria-hidden
        >
          {badge.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={badge.iconUrl}
              alt=""
              className="w-10 h-10 object-contain"
            />
          ) : (
            badge.iconLabel ?? "🏅"
          )}
        </div>
        <h3 className="text-sm font-semibold text-white/95">{badge.name}</h3>
        <p className="text-xs text-white/60 line-clamp-2">{badge.description}</p>
        {!badge.unlocked && (
          <span className="text-xs text-white/40">Chưa mở khóa</span>
        )}
        {onDetails && (
          <button
            type="button"
            onClick={() => onDetails(badge)}
            className="mt-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            Chi tiết
          </button>
        )}
      </div>
    </article>
  );
}
