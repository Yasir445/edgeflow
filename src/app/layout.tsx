import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: { default: "EdgeFlow", template: "%s | EdgeFlow" },
  description: "The AI-powered trading journal for serious traders. Track trades, analyze performance, and build consistency with psychology-focused insights.",
  keywords: ["trading journal", "trade tracker", "trading analytics", "AI trading coach", "trading psychology"],
  openGraph: {
    title: "EdgeFlow — AI Trading Journal",
    description: "Track trades, analyze performance, and build consistency.",
    url: "https://edgeflow.app",
    siteName: "EdgeFlow",
    type: "website",
  },
  manifest: "/manifest.json",
  themeColor: "#080c10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmMono.variable} font-sans bg-bg text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
