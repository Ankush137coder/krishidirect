// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KrishiDirect — Kisan to Vendor Direct Bridge",
  description: "Connecting farmers directly with local vendors to cut post-harvest waste.",
};

// Next.js renders this into <meta name="viewport" content="width=device-width, initial-scale=1">
// — do not also hand-write that tag in a <head>, App Router owns it via this export.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      {/*
        overflow-x-hidden on both html and body catches horizontal scroll caused by
        any descendant (fixed-position widgets, negative-margin decorative shapes,
        off-canvas modals) regardless of which component introduces it.
      */}
      <body className="w-full max-w-full overflow-x-hidden bg-[#FBF7EF] font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
