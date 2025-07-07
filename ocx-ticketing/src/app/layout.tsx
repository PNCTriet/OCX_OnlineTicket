import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ớt cay xè indie show | Sự kiện âm nhạc đỉnh vãi l*n",
  description:
    "Mua vé sự kiện âm nhạc OCX nhanh chóng, an toàn, tiện lợi. Thông tin nghệ sĩ, lineup, FAQ, và nhiều hơn nữa.",
  keywords: [
    "OCX",
    "Online Ticket",
    "Mua vé",
    "Sự kiện âm nhạc",
    "Concert",
    "Lineup",
    "Nghệ sĩ",
    "Vé online",
  ],
  authors: [{ name: "OCX Team" }],
  robots: "index, follow",
  metadataBase: new URL("https://ocx-online-ticket.vercel.app/"),
  openGraph: {
    type: "website",
    url: "https://ocx-online-ticket.vercel.app/",
    title: "OCX Online Ticket | Mua vé sự kiện âm nhạc HOT nhất",
    description:
      "Mua vé sự kiện âm nhạc OCX nhanh chóng, an toàn, tiện lợi. Thông tin nghệ sĩ, lineup, FAQ, và nhiều hơn nữa.",
    images: [
      {
        url: "/images/client_logo_ss4_thumb.png",
        width: 800,
        height: 600,
        alt: "OCX Online Ticket Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OCX Online Ticket | Mua vé sự kiện âm nhạc HOT nhất",
    description:
      "Mua vé sự kiện âm nhạc OCX nhanh chóng, an toàn, tiện lợi. Thông tin nghệ sĩ, lineup, FAQ, và nhiều hơn nữa.",
    images: [
      {
        url: "/images/client_logo_ss4_thumb.png",
        alt: "OCX Online Ticket Logo",
      },
    ],
    site: "@ocx_ticket", // Thay bằng Twitter handle nếu có
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/client_logo_ss4_thumb.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
