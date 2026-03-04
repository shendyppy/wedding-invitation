// ============================================================
// Root Layout — App Shell
// Loads Google Fonts, metadata, and global providers.
// ============================================================

import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Source_Sans_3, Love_Light, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: "400",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const loveLight = Love_Light({
  subsets: ["latin"],
  variable: "--font-love-light",
  weight: "400",
  display: "swap",
});

// Admin theme fonts
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
        className={`${cormorant.variable} ${greatVibes.variable} ${sourceSans.variable} ${loveLight.variable} ${playfairDisplay.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
