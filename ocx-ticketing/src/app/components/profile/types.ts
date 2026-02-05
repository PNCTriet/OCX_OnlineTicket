/**
 * Profile page types – UI & data state.
 * Prepared for React Query / SWR integration.
 */

export type TicketStatusTab = "upcoming" | "used" | "expired";

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
  /** Icon name or emoji fallback */
  iconLabel?: string;
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
