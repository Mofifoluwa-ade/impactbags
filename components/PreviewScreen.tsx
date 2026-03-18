"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Rocket, RefreshCw } from "lucide-react";
import { GeneratedToken } from "@/types";
import { FEE_SPLITS } from "@/lib/mock-data";

interface PreviewScreenProps {
  token: GeneratedToken;
  onBack: () => void;
  onLaunch: () => void;
}

export function PreviewScreen({ token, onBack, onLaunch }: PreviewScreenProps) {
  const [barsLoaded, setBarsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="screen-enter space-y-4 pt-2">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm transition-colors duration-150"
        style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")
        }
      >
        <ArrowLeft size={15} />
        Back to edit
      </button>

      {/* Token card */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: "var(--bg-surface2)" }}
          >
            {token.emoji}
          </div>
          <div>
            <div
              className="text-xl font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-syne)", color: "var(--text-primary)" }}
            >
              {token.name}
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
            >
              ${token.ticker}
            </div>
          </div>
        </div>

        <div
          className="text-sm leading-relaxed pt-3"
          style={{
            color: "var(--text-secondary)",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          {token.description}
        </div>

        <div
          className="rounded-xl p-3"
          style={{ background: "var(--bg-surface2)" }}
        >
          <div
            className="text-[10px] uppercase tracking-widest mb-1"
            style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
          >
            Cause wallet funds
          </div>
          <div className="text-sm" style={{ color: "var(--text-primary)" }}>
            {token.causeWallet}
          </div>
        </div>
      </div>

      {/* Fee splits */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          Fee split on every trade
        </div>

        <div className="space-y-3">
          {FEE_SPLITS.map((f) => (
            <div key={f.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {f.label}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: f.color, fontFamily: "var(--font-mono)" }}
                >
                  {f.pct}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--bg-surface2)" }}
              >
                <div
                  className="fee-bar-fill"
                  style={{
                    width: barsLoaded ? `${f.pct}%` : "0%",
                    background: f.color,
                  }}
                />
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {f.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viral hook */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          borderLeft: "3px solid var(--gold)",
        }}
      >
        <div
          className="text-[10px] uppercase tracking-widest mb-2"
          style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
        >
          Your viral hook
        </div>
        <div
          className="text-sm leading-relaxed italic"
          style={{ color: "var(--text-primary)" }}
        >
          &ldquo;{token.viralHook}&rdquo;
        </div>
        <div className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
          This is auto-filled in your share message when you post to WhatsApp / X
        </div>
      </div>

      {/* Bags SDK note */}
      <div
        className="rounded-xl px-4 py-3 text-xs leading-relaxed"
        style={{
          background: "var(--bg-surface2)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span style={{ color: "var(--green)" }}>✓</span> Launching via Bags SDK
        &rarr; token created on Solana &rarr; fee splits set on-chain &rarr;
        live in ~3s
      </div>

      {/* Buttons */}
      <button
        onClick={onLaunch}
        className="btn-green w-full py-4 text-base flex items-center justify-center gap-2"
        style={{ fontSize: "17px" }}
      >
        <Rocket size={18} />
        Launch on Bags
      </button>

      <button
        onClick={onBack}
        className="btn-outline w-full py-3 text-sm flex items-center justify-center gap-2"
      >
        <RefreshCw size={14} />
        Change my cause
      </button>
    </div>
  );
}
