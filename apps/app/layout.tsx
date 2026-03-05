// ============================================================
// Root Layout — App Shell
// Loads Google Fonts, metadata, and global providers.
// ============================================================

import type { Metadata } from "next";
import { Love_Light, DM_Sans } from "next/font/google";
import "./globals.css";

// Wedding invitation fonts
const loveLight = Love_Light({
  subsets: ["latin"],
  variable: "--font-love-light",
  weight: "400",
  display: "swap",
});

// Admin theme fonts
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stevana & Zulfikar Wedding",
  description:
    "You are invited to the wedding of Stevana Oktavia Yohans & Muchamad Zulfikar — April 11, 2026 at Villa Lagenta Lembang.",
  openGraph: {
    title: "Stevana & Zulfikar Wedding",
    description:
      "You are invited to witness the beginning of our forever. Join us on April 11, 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${loveLight.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
