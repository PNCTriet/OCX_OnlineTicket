import type { LucideIcon } from "lucide-react";
import { Ticket, Bird, Home, Flame, Medal } from "lucide-react";
import type { ProfileBadgeIconKey } from "./types";

/** Khóa icon huy hiệu — map sang Lucide (màu qua OnyxIcon) */
export const PROFILE_BADGE_ICON_MAP: Record<
  ProfileBadgeIconKey,
  LucideIcon
> = {
  ticket: Ticket,
  bird: Bird,
  home: Home,
  flame: Flame,
  medal: Medal,
};

export function getBadgeIcon(key?: ProfileBadgeIconKey): LucideIcon {
  return key ? PROFILE_BADGE_ICON_MAP[key] : Medal;
}
