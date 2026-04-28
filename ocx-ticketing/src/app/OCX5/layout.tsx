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
  title: "Ớt Cay Xè Hà Nội — Học Viện Âm Nhạc & Phép Thuật | 07.2026",
  description:
    "🔥 HỌC VIỆN ÂM NHẠC & PHÉP THUẬT ỚT CAY XÈ công bố ngày tựu trường! Nhạc cực căng, vibe cực bén, năng lượng cực cháy. Vé tàu tốc hành chỉ dành cho ai nhanh tay nhất. Thời gian: 18/04/2026. Địa điểm: Sài Gòn. Standing 569.000₫ • Seating 589.000₫. Liên hệ: otconcert@gmail.com",
  keywords: [
    "Ớt Cay Xè",
    "Otcayxe",
    "OCX5",
    "Ớt Cay Xè Hà Nội",
    "indie music",
    "music show",
    "indiemusic",
    "concert",
    "show âm nhạc",
    "Sài Gòn",
    "mua vé",
    "vé concert",
    "standing",
    "seating",
    "otconcert@gmail.com",
  ],
  authors: [{ name: "OCX Team" }],
  robots: "index, follow",
  metadataBase: new URL(getBaseUrl()),
  openGraph: {
    url: `${baseUrl}/OCX5`,
    type: "website",
    title: "🔥 Học Viện Âm Nhạc & Phép Thuật Ớt Cay Xè — OCX5 | 07.2026",
    description:
      "Năm học mới tại Trường phép thuật Ớt Cay Xè chính thức bắt đầu. Nhạc cực căng, vibe cực bén. Vé tàu tốc hành chỉ dành cho ai nhanh tay nhất. 18/04/2026 • Sài Gòn • Standing 569.000₫ • Seating 589.000₫.",
    images: [
      {
        url: "https://www.otcayxe.com/images/client_logo_ss5_thumb.png",
        width: 1200,
        height: 630,
        alt: "Ớt Cay Xè Hà Nội (OCX5) — Official",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ớt Cay Xè Hà Nội (OCX5) — Official Ticket | 07.2026",
    description:
      "🔥 HỌC VIỆN ÂM NHẠC & PHÉP THUẬT Ớt Cay Xè. 18/04/2026 • Sài Gòn • Standing 569.000₫ • Seating 589.000₫. Follow Ớt Cay Xè để cập nhật thêm thông tin!",
    images: [
      {
        url: "https://www.otcayxe.com/images/client_logo_ss5_thumb.png",
        alt: "Ớt Cay Xè Hà Nội (OCX5) — Official",
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

