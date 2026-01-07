import type { Metadata } from "next";

const baseUrl = "https://www.otcayxe.com";

// Get the base URL from environment variables
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://www.otcayxe.com";
  }
  return "http://localhost:3000";
};

export const metadata: Metadata = {
  title: "OCX5 - Magical Concert Experience | Ớt Cay Xè 5",
  description:
    "Experience the magic of OCX5 - A fantasy-inspired concert event. Discover lineup, pricing, and secure your tickets for this enchanting musical journey.",
  keywords: [
    "OCX5",
    "OCX",
    "Concert",
    "Magical Event",
    "Fantasy Concert",
    "Music Event",
    "Lineup",
    "Ticket",
    "Mua vé",
    "Sự kiện âm nhạc",
  ],
  authors: [{ name: "OCX Team" }],
  robots: "index, follow",
  metadataBase: new URL(getBaseUrl()),
  openGraph: {
    url: `${baseUrl}/OCX5`,
    type: "website",
    title: "OCX5 - Magical Concert Experience",
    description:
      "Experience the magic of OCX5 - A fantasy-inspired concert event. Discover lineup, pricing, and secure your tickets.",
    images: [
      {
        url: "https://www.otcayxe.com/images/client_logo_ss4_thumb.png",
        width: 1200,
        height: 630,
        alt: "OCX5 Magical Concert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OCX5 - Magical Concert Experience",
    description:
      "Experience the magic of OCX5 - A fantasy-inspired concert event.",
    images: [
      {
        url: "https://www.otcayxe.com/images/client_logo_ss4_thumb.png",
        alt: "OCX5 Magical Concert",
      },
    ],
    site: "@ocx_ticket",
  },
  other: {
    "fb:app_id": "1241434124376586",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "https://www.otcayxe.com/images/client_logo_ss4_thumb.png",
  },
};

export default function OCX5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

