"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";
import { Wallet, LogOut, ChevronDown, ExternalLink } from "lucide-react";
import { cn, shortenAddress } from "@/lib/utils";
import type { ConnectedUser } from "@/types";

interface NavbarProps {
  user: ConnectedUser | null;
  onUserChange: (u: ConnectedUser | null) => void;
  showLaunchBtn?: boolean;
}

export function Navbar({ user, onUserChange, showLaunchBtn = false }: NavbarProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onConnected={(u) => { onUserChange(u); setAuthOpen(false); }}
      />

      <header className="w-full sticky top-0 z-30 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-light-border dark:border-dark-border">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-brand-gold/20 flex items-center justify-center">
              <span className="text-brand-gold text-lg">⚡</span>
            </div>
            <span className="font-syne text-lg font-extrabold">
              <span className="text-brand-gold">Impact</span>
              <span className="text-brand-green">Bags</span>
            </span>
          </Link>

          {/* Center nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              How it works
            </Link>
            <Link href="/#launches" className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Live launches
            </Link>
            <a href="https://dev.bags.fm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Bags Docs <ExternalLink size={11} />
            </a>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {showLaunchBtn && (
              <Link
                href="/launch"
                className={cn(
                  "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium",
                  "bg-brand-gold/10 border border-brand-gold/30 text-brand-gold",
                  "hover:bg-brand-gold/20 transition-all duration-150"
                )}
              >
                ✦ Launch token
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm",
                    "bg-light-surface dark:bg-dark-surface",
                    "border border-light-border dark:border-dark-border",
                    "text-gray-700 dark:text-gray-300 hover:border-brand-gold/40 transition-all"
                  )}
                >
                  <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center text-xs">
                    {user.avatar ?? "✦"}
                  </div>
                  <span className="font-mono text-xs max-w-[80px] truncate">
                    {user.displayName}
                  </span>
                  <ChevronDown size={12} className={cn("transition-transform", dropOpen && "rotate-180")} />
                </button>
                {dropOpen && (
                  <div
                    className={cn(
                      "absolute right-0 mt-2 w-44 rounded-2xl py-1.5 z-10",
                      "bg-light-surface dark:bg-dark-surface",
                      "border border-light-border dark:border-dark-border shadow-xl"
                    )}
                  >
                    {user.address && (
                      <div className="px-3 py-2 border-b border-light-border dark:border-dark-border">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">Wallet</div>
                        <div className="font-mono text-xs text-gray-700 dark:text-gray-300 mt-0.5">{shortenAddress(user.address)}</div>
                      </div>
                    )}
                    <button
                      onClick={() => { onUserChange(null); setDropOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut size={14} />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium",
                  "bg-brand-gold text-gray-900 hover:bg-brand-gold-light transition-all duration-150"
                )}
              >
                <Wallet size={14} />
                <span className="hidden sm:inline">Connect</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
