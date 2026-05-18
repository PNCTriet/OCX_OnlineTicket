import type { Metadata } from "next";
import { sitePageMetadata } from "@/lib/metadata-ticket";

export const metadata: Metadata = sitePageMetadata;

export default function TicketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
