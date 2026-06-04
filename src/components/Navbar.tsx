"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";
import { Wallet, LogOut, ChevronDown, ExternalLink, User } from "lucide-react";
import { cn, shortenAddress } from "@/lib/utils";
import type { ConnectedUser } from "@/types";

interface NavbarProps {
  /** Pass wallet state managed locally in the page */
  walletUser?: ConnectedUser | null;
  onWalletChange?: (u: ConnectedUser | null) => void;
  showLaunchBtn?: boolean;
}

export function Navbar({ walletUser, onWalletChange, showLaunchBtn = false }: NavbarProps) {
  const { data: session, status } = useSession(); // real NextAuth session
  const [authOpen,  setAuthOpen]  = useState(false);
  const [dropOpen,  setDropOpen]  = useState(false);

  // Determine who is "logged in":
  // Priority: wallet connection > NextAuth OAuth session
  const oauthUser = session?.user;
  const isLoading = status === "loading";

  const displayName =
    walletUser?.displayName ??
    oauthUser?.name ??
    (oauthUser?.email ? oauthUser.email.split("@")[0] : null);

  const avatar =
    walletUser?.avatar ??
    oauthUser?.image ??
    null;

  const isConnected = !!(walletUser || oauthUser);

  const handleDisconnect = async () => {
    if (walletUser) {
      // Disconnect Solana wallet
      try {
        const win = window as any;
        if (win.solana?.isConnected)   await win.solana.disconnect();
        if (win.solflare?.isConnected) await win.solflare.disconnect();
      } catch {}
      onWalletChange?.(null);
    } else {
      // Sign out of NextAuth session
      await signOut({ redirect: false });
    }
    setDropOpen(false);
  };

  return (
    <>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onConnected={(u) => { onWalletChange?.(u); setAuthOpen(false); }}
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
              <span className="text-brand-green">AI</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">How it works</Link>
            <Link href="/#launches"     className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Launches</Link>
            {isConnected && (
              <Link href="/portfolio" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Portfolio</Link>
            )}
            <a href="https://dev.bags.fm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Docs <ExternalLink size={11} />
            </a>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {showLaunchBtn && (
              <Link href="/launch" className={cn("hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium", "bg-brand-gold/10 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/20 transition-all")}>
                ✦ Launch token
              </Link>
            )}

            {isLoading ? (
              /* Skeleton while NextAuth checks session */
              <div className="h-8 w-24 rounded-xl bg-light-surface2 dark:bg-dark-surface2 animate-pulse" />
            ) : isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(p => !p)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm",
                    "bg-light-surface dark:bg-dark-surface",
                    "border border-light-border dark:border-dark-border",
                    "text-gray-700 dark:text-gray-300 hover:border-brand-gold/40 transition-all"
                  )}
                >
                  {/* Avatar */}
                  {avatar && !avatar.startsWith("http") ? (
                    <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center text-[10px] font-bold text-brand-green">
                      {avatar}
                    </div>
                  ) : avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center">
                      <User size={11} className="text-brand-gold" />
                    </div>
                  )}
                  <span className="font-mono text-xs max-w-[90px] truncate">{displayName}</span>
                  <ChevronDown size={12} className={cn("transition-transform duration-200", dropOpen && "rotate-180")} />
                </button>

                {/* Dropdown */}
                {dropOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                    <div className={cn(
                      "absolute right-0 mt-2 w-48 rounded-2xl py-1.5 z-20 shadow-xl",
                      "bg-light-surface dark:bg-dark-surface",
                      "border border-light-border dark:border-dark-border"
                    )}>
                      {/* Info rows */}
                      {walletUser?.address && (
                        <div className="px-3 py-2 border-b border-light-border dark:border-dark-border">
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Wallet</div>
                          <div className="font-mono text-xs text-gray-700 dark:text-gray-300 mt-0.5">{shortenAddress(walletUser.address)}</div>
                        </div>
                      )}
                      {oauthUser?.email && (
                        <div className="px-3 py-2 border-b border-light-border dark:border-dark-border">
                          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Account</div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 truncate">{oauthUser.email}</div>
                        </div>
                      )}
                      <Link href="/portfolio" onClick={() => setDropOpen(false)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-light-surface2 dark:hover:bg-dark-surface2 transition-colors">
                        <User size={14} /> My portfolio
                      </Link>
                      <Link href="/launch" onClick={() => setDropOpen(false)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-light-surface2 dark:hover:bg-dark-surface2 transition-colors">
                        ✦ Launch a token
                      </Link>
                      <button
                        onClick={handleDisconnect}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors rounded-b-2xl"
                      >
                        <LogOut size={14} />
                        {walletUser ? "Disconnect wallet" : "Sign out"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-brand-gold text-gray-900 hover:bg-brand-gold-light transition-all duration-150"
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
