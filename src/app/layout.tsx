import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-sans", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

export const metadata: Metadata = {
  title: "ImpactBags — Community Tokens, Real Change",
  description: "Launch a Solana token for any community cause in 60 seconds. Clean energy, education, water, healthcare — fund it with crypto, prove it on-chain.",
  openGraph: { title: "ImpactBags — Community Tokens, Real Change", description: "Launch a community impact token on Solana in 60 seconds.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-dm antialiased min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
        <AuthSessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
