"use client";

import { OnyxIcon } from "@/components/ui/OnyxIcon";
import { getBadgeIcon } from "./profileBadgeIcons";
import type { ProfileBadge } from "./types";

export interface BadgeCardProps {
  badge: ProfileBadge;
  onDetails?: (badge: ProfileBadge) => void;
  className?: string;
}

const RARITY_CLASS: Record<string, string> = {
  common: "border-[#404040] text-[#A1A1A1]",
  rare: "border-blue-400/40 text-blue-300/90",
  epic: "border-purple-400/40 text-purple-300/90",
  legendary: "border-amber-400/50 text-amber-300/95",
};

export default function BadgeCard({
  badge,
  onDetails,
  className = "",
}: BadgeCardProps) {
  const rarityClass = badge.rarity ? RARITY_CLASS[badge.rarity] ?? RARITY_CLASS.common : "border-[#404040] text-[#A1A1A1]";

  return (
    <article
      className={`rounded-xl border bg-[#0F0F0F] p-4 transition-colors ${
        badge.unlocked ? rarityClass : "border-[#262626] opacity-60"
      } ${className}`}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className={`flex size-12 items-center justify-center rounded-full text-2xl ${
            badge.unlocked ? "bg-[#212121]" : "bg-[#141414] grayscale"
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
            <OnyxIcon icon={getBadgeIcon(badge.iconKey)} size={28} />
          )}
        </div>
        <h3 className="text-sm font-semibold text-[#FAFAFA]">{badge.name}</h3>
        <p className="line-clamp-2 text-xs text-[#A1A1A1]">{badge.description}</p>
        {!badge.unlocked && (
          <span className="text-xs text-[#525252]">Chưa mở khóa</span>
        )}
        {onDetails && (
          <button
            type="button"
            onClick={() => onDetails(badge)}
            className="mt-1 text-xs font-medium text-[#FF6B1A] transition-colors hover:text-[#FF7A33]"
          >
            Chi tiết
          </button>
        )}
      </div>
    </article>
  );
}
