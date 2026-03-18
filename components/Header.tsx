"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Zap } from "lucide-react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        background: "color-mix(in srgb, var(--bg-primary) 85%, transparent)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--gold-bg)", border: "1px solid var(--border-color)" }}
          >
            <Zap size={16} style={{ color: "var(--gold)" }} fill="currentColor" />
          </div>
          <div>
            <div
              className="font-syne font-extrabold text-lg leading-none"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              <span style={{ color: "var(--gold)" }}>Impact</span>
              <span style={{ color: "var(--green)" }}>Bags</span>
            </div>
            <div
              className="text-[10px] leading-none mt-0.5"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              Powered by Bags SDK · Solana
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Network badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
            style={{
              background: "var(--green-bg)",
              color: "var(--green)",
              border: "1px solid var(--border-color)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span className="live-dot" />
            Mainnet
          </div>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
              aria-label="Toggle theme"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--border-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--border-color)";
              }}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          {/* Connect wallet (UI only) */}
          <button
            className="btn-outline px-3 py-1.5 text-sm font-medium hidden sm:block"
            style={{ fontFamily: "var(--font-dm)" }}
            onClick={() => alert("Wallet connection: integrate @solana/wallet-adapter-react")}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
}
