import type { Metadata } from "next";

const baseUrl = "https://www.otcayxe.com";
const ogImage = `${baseUrl}/images/client_logo_ss5_thumb.png`;

/** URL chính để share (www.otcayxe.com). */
export const SITE_URL = baseUrl;

export function getSiteMetadataBase() {
  if (process.env.NODE_ENV === "production") {
    return new URL(baseUrl);
  }
  return new URL("http://localhost:3000");
}

/** Metadata trang chủ / mua vé — canonical & og:url trỏ domain gốc. */
export const sitePageMetadata: Metadata = {
  title: "Ớt Cay Xè Hà Nội | 08.2026",
  description:
    "OCX indie show | Mua vé online Ớt Cay Xè Hà Nội — lineup indie, số lượng có hạn. Thủ đô Hà Nội · 08/2026. Liên hệ: otconcert@gmail.com",
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
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    type: "website",
    title: "Ớt Cay Xè Hà Nội | 08.2026",
    description:
      "OCX indie show | Mua vé online tại Hà Nội. Lineup indie, số lượng có hạn · 08/2026.",
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
    title: "Ớt Cay Xè Hà Nội | 08.2026",
    description:
      "OCX indie show | Mua vé online · 08/2026. Theo dõi Ớt Cay Xè để cập nhật.",
    images: [
      {
        url: ogImage,
        alt: "Ớt Cay Xè Hà Nội — Mua vé online",
      },
    ],
    site: "@ocx_ticket",
  },
};

/** @deprecated Dùng sitePageMetadata — giữ alias cho layout /ticket. */
export const ticketPageMetadata = sitePageMetadata;
