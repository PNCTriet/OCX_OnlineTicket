import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteMetadataBase, sitePageMetadata } from "@/lib/metadata-ticket";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...sitePageMetadata,
  metadataBase: getSiteMetadataBase(),
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
