import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Head from "next/head";

const baseUrl = "https://www.otcayxe.com";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Get the base URL from environment variables
const getBaseUrl = () => { 
  // Use production URL by default, fallback to localhost for development
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.otcayxe.com';
  }
  
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  title: "Ớt cay xè 4",
  description: "OCX indie show | Sự kiện âm nhạc đỉnh VKL",
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

  // Use a function to get the base URL to ensure it's always valid
  metadataBase: new URL(getBaseUrl()),

  openGraph: {
    url: baseUrl,
    type: "website",
    title: "Ớt cay xè 4",
    description: "OCX indie show | Sự kiện âm nhạc đỉnh VKL",
    images: [
      {
        url: "https://www.otcayxe.com/images/client_logo_ss4_thumb.png",
        width: 800,
        height: 600,
        alt: "OCX Online Ticket Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ớt cay xè 4",
    description: "OCX indie show | Sự kiện âm nhạc đỉnh VKL",
    images: [
      {
        url: "https://www.otcayxe.com/images/client_logo_ss4_thumb.png",
        alt: "OCX Online Ticket Logo",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <Head>
        <meta property="fb:app_id" content="1241434124376586" />
      </Head>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

