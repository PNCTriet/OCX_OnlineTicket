import type { Metadata } from "next";

const baseUrl = "https://www.otcayxe.com";
const ogImage = "https://www.otcayxe.com/images/client_logo_ss5_thumb.png";
const ticketUrl = `${baseUrl}/ticket`;

export function getSiteMetadataBase() {
  if (process.env.NODE_ENV === "production") {
    return new URL(baseUrl);
  }
  return new URL("http://localhost:3000");
}

/** Metadata cho trang mua vé /ticket (OG, Twitter, canonical). */
export const ticketPageMetadata: Metadata = {
  title: "Mua vé | Ớt Cay Xè Hà Nội | 08.2026",
  description:
    "Mua vé online Ớt Cay Xè Hà Nội — OCX indie show, lineup indie, số lượng có hạn. Thủ đô Hà Nội · 08/2026. Liên hệ: otconcert@gmail.com",
  keywords: [
    "Ớt Cay Xè",
    "Otcayxe",
    "OCX",
    "Ớt Cay Xè Hà Nội",
    "mua vé",
    "vé online",
    "vé concert",
    "indie music",
    "concert",
    "show âm nhạc",
    "Hà Nội",
    "08/2026",
    "otconcert@gmail.com",
  ],
  authors: [{ name: "OCX Team" }],
  robots: "index, follow",
  metadataBase: getSiteMetadataBase(),
  alternates: {
    canonical: ticketUrl,
  },
  openGraph: {
    url: ticketUrl,
    type: "website",
    title: "Mua vé | Ớt Cay Xè Hà Nội | 08.2026",
    description:
      "Mua vé online Ớt Cay Xè Hà Nội — OCX indie show tại Hà Nội. Lineup indie, số lượng có hạn · 08/2026.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Ớt Cay Xè Hà Nội — Mua vé online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mua vé | Ớt Cay Xè Hà Nội | 08.2026",
    description:
      "Mua vé online Ớt Cay Xè Hà Nội — OCX indie show · 08/2026. Theo dõi Ớt Cay Xè để cập nhật.",
    images: [
      {
        url: ogImage,
        alt: "Ớt Cay Xè Hà Nội — Mua vé online",
      },
    ],
    site: "@ocx_ticket",
  },
};
