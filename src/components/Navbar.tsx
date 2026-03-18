"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Wallet, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  screen: string;
}

export function Navbar({ screen }: NavbarProps) {
  return (
    <header className="w-full sticky top-0 z-30 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-light-border dark:border-dark-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div>
          <div className="font-syne text-xl font-extrabold leading-none">
            <span className="text-brand-gold">Impact</span>
            <span className="text-brand-green">Bags</span>
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-0.5 hidden sm:block">
            Community tokens · Solana
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://bags.fm"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium",
              "bg-light-surface dark:bg-dark-surface",
              "border border-light-border dark:border-dark-border",
              "text-gray-500 dark:text-gray-500",
              "hover:text-brand-gold hover:border-brand-gold/40 transition-all duration-150"
            )}
          >
            <ExternalLink size={11} />
            bags.fm
          </a>
          <button
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium",
              "bg-brand-gold/10 text-brand-gold",
              "border border-brand-gold/30",
              "hover:bg-brand-gold/20 transition-all duration-150"
            )}
            onClick={() => alert("Wallet connect: Install @solana/wallet-adapter-react and add <WalletMultiButton /> here")}
          >
            <Wallet size={12} />
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Wallet</span>
          </button>
        </div>
      </div>
    </header>
  );
}
