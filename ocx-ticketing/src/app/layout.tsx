import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteMetadataBase } from "@/lib/metadata-ticket";

const baseUrl = "https://www.otcayxe.com";
const ticketUrl = `${baseUrl}/ticket`;
const ogImage = `${baseUrl}/images/client_logo_ss5_thumb.png`;
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Metadata mặc định site (trang con như /ticket ghi đè trong layout riêng). */
export const metadata: Metadata = {
  title: "Ớt Cay Xè Hà Nội | 08.2026",
  description:
    "OCX indie show | Sự kiện âm nhạc Ớt Cay Xè tại Hà Nội. Mua vé online · 08/2026.",
  keywords: [
    "OCX",
    "Ớt Cay Xè",
    "Ớt Cay Xè Hà Nội",
    "Online Ticket",
    "Mua vé",
    "Sự kiện âm nhạc",
    "Concert",
    "Lineup",
    "Hà Nội",
    "08/2026",
    "Vé online",
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
    title: "Ớt Cay Xè Hà Nội | 08.2026",
    description:
      "OCX indie show | Sự kiện âm nhạc tại Hà Nội. Mua vé online · 08/2026.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Ớt Cay Xè Hà Nội",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ớt Cay Xè Hà Nội | 08.2026",
    description:
      "OCX indie show | Sự kiện âm nhạc tại Hà Nội. Mua vé online · 08/2026.",
    images: [
      {
        url: ogImage,
        alt: "Ớt Cay Xè Hà Nội",
      },
    ],
    site: "@ocx_ticket",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "https://www.otcayxe.com/images/client_logo_ss5_thumb.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta property="fb:app_id" content="1241434124376586" />
      </head>
      <body className="font-sans antialiased bg-[#0A0A0A] text-[#FAFAFA]">
        <AuthProvider>{children}</AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

