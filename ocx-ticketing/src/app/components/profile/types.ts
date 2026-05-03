/**
 * Profile page types – UI & data state.
 * Prepared for React Query / SWR integration.
 */

export type TicketStatusTab = "upcoming" | "used" | "expired";

/** Khớp `PROFILE_BADGE_ICON_MAP` — icon Lucide */
export type ProfileBadgeIconKey = "ticket" | "bird" | "home" | "flame" | "medal";

export interface ProfileTicket {
  id: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  status: "upcoming" | "used" | "expired";
  /** Disabled for actions (e.g. already used) */
  disabled?: boolean;
  /** Can transfer to another user */
  transferable?: boolean;
}

export interface ProfileBadge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  iconKey?: ProfileBadgeIconKey;
  unlocked: boolean;
  /** Optional for future rarity tiers */
  rarity?: "common" | "rare" | "epic" | "legendary";
}

export interface ProfileUser {
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  /** Email verified */
  verified: boolean;
  /** Optional: total tickets owned (for header) */
  totalTickets?: number;
}
