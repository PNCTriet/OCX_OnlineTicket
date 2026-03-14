/**
 * Mock data for Profile page – replace with API / React Query later.
 */

import type { ProfileTicket, ProfileBadge } from "./types";

export const MOCK_TICKETS: ProfileTicket[] = [
  {
    id: "t1",
    eventName: "Ớt Cay Xè 5 — Học Viện Âm Nhạc & Phép Thuật",
    date: "18/04/2026",
    time: "15:00",
    venue: "Sân Patin Việt Nam Roller Rink",
    status: "upcoming",
    disabled: false,
    transferable: true,
  },
  {
    id: "t2",
    eventName: "Ớt Cay Xè 4",
    date: "20/03/2025",
    time: "19:00",
    venue: "Sài Gòn",
    status: "used",
    disabled: true,
    transferable: false,
  },
  {
    id: "t3",
    eventName: "Một sự kiện cũ",
    date: "01/01/2024",
    time: "18:00",
    venue: "Hà Nội",
    status: "expired",
    disabled: true,
    transferable: false,
  },
];

export const MOCK_BADGES: ProfileBadge[] = [
  {
    id: "b1",
    name: "First Ticket",
    description: "Mua vé đầu tiên",
    iconLabel: "🎟️",
    unlocked: true,
    rarity: "common",
  },
  {
    id: "b2",
    name: "Early Bird",
    description: "Mua vé trước ngày công bố",
    iconLabel: "🐦",
    unlocked: true,
    rarity: "rare",
  },
  {
    id: "b3",
    name: "House Champion",
    description: "Chọn nhà và hoàn thành mua vé",
    iconLabel: "🏠",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "b4",
    name: "Super Fan",
    description: "Tham dự 3 sự kiện OCX",
    iconLabel: "🔥",
    unlocked: false,
    rarity: "legendary",
  },
];
