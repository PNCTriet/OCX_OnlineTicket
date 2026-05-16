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
  title: "Ớt Cay Xè Hà Nội | 08.2026",
  description:
    "OCX indie show | Sự kiện âm nhạc Ớt Cay Xè tại Hà Nội. Mua vé online, lineup indie, giới hạn số lượng. Liên hệ: otconcert@gmail.com",
  keywords: [
    "Ớt Cay Xè",
    "Otcayxe",
    "OCX",
    "Ớt Cay Xè Hà Nội",
    "indie music",
    "music show",
    "concert",
    "show âm nhạc",
    "Hà Nội",
    "mua vé",
    "vé concert",
    "vé online",
    "otconcert@gmail.com",
  ],
  authors: [{ name: "OCX Team" }],
  robots: "index, follow",
  metadataBase: new URL(getBaseUrl()),
  openGraph: {
    url: `${baseUrl}/OCX5`,
    type: "website",
    title: "Ớt Cay Xè Hà Nội | 08.2026",
    description:
      "OCX indie show | Sự kiện âm nhạc tại Hà Nội. Mua vé online — lineup indie, số lượng có hạn.",
    images: [
      {
        url: "https://www.otcayxe.com/images/client_logo_ss5_thumb.png",
        width: 1200,
        height: 630,
        alt: "Ớt Cay Xè Hà Nội — Official",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ớt Cay Xè Hà Nội | 08.2026",
    description:
      "OCX indie show | Sự kiện âm nhạc tại Hà Nội. Mua vé online — theo dõi Ớt Cay Xè để cập nhật.",
    images: [
      {
        url: "https://www.otcayxe.com/images/client_logo_ss5_thumb.png",
        alt: "Ớt Cay Xè Hà Nội — Official",
      },
    ],
    site: "@ocx_ticket",
  },
  other: {
    "fb:app_id": "1241434124376586",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "https://www.otcayxe.com/images/client_logo_ss5_thumb.png",
  },
};

export default function OCX5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

