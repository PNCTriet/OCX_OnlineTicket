import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Get the base URL from environment or default to localhost
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000';

export const metadata: Metadata = {
  title: "Ớt cay xè 4",
  description: "OCX indie show | Sự kiện âm nhạc đỉnh vãi l*n",
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

  metadataBase: new URL(baseUrl),

  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Ớt cay xè 4",
    description: "OCX indie show | Sự kiện âm nhạc đỉnh vãi l*n",
    images: [
      {
        url: "/images/client_logo_ss4_thumb.png", // Use relative path
        width: 800,
        height: 600,
        alt: "OCX Online Ticket Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ớt cay xè 4",
    description: "OCX indie show | Sự kiện âm nhạc đỉnh vãi l*n",
    images: [
      {
        url: "/images/client_logo_ss4_thumb.png", // Use relative path
        alt: "OCX Online Ticket Logo",
      },
    ],
    site: "@ocx_ticket",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/images/client_logo_ss4_thumb.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
