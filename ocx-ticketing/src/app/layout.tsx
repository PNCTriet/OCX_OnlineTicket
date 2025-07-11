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

  // ✅ Cập nhật domain chính thức đã custom (www.otcayxe.com)
  metadataBase: new URL("https://www.otcayxe.com"),

  openGraph: {
    type: "website",
    url: "https://www.otcayxe.com",
    title: "Ớt cay xè 4",
    description: "OCX indie show | Sự kiện âm nhạc đỉnh vãi l*n",
    images: [
      {
        url: "https://www.otcayxe.com/images/client_logo_ss4_thumb.png", // ✅ phải dùng full URL tuyệt đối
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
        url: "https://www.otcayxe.com/images/client_logo_ss4_thumb.png", // ✅ full URL
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
