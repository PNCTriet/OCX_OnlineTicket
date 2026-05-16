import type { Metadata } from "next";
import { ticketPageMetadata } from "@/lib/metadata-ticket";

export const metadata: Metadata = ticketPageMetadata;

export default function TicketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
