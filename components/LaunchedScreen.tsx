"use client";

import { useEffect, useState, useRef } from "react";
import { Share2, Copy, QrCode, Plus } from "lucide-react";
import { GeneratedToken } from "@/types";

interface LaunchedScreenProps {
  token: GeneratedToken;
  onReset: () => void;
}

interface Stats {
  raised: number;
  supporters: number;
  causeAmount: number;
  creatorAmount: number;
  volume: number;
}

export function LaunchedScreen({ token, onReset }: LaunchedScreenProps) {
  const [stats, setStats] = useState<Stats>({
    raised: 0,
    supporters: 0,
    causeAmount: 0,
    creatorAmount: 0,
    volume: 0,
  });
  const [copied, setCopied] = useState(false);
  const [proofImages, setProofImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const tokenUrl = `https://bags.fm/token/${token.ticker}`;

  useEffect(() => {
    const target = Math.floor(Math.random() * 900) + 300;
    const supTarget = Math.floor(target / 10);
    const volTarget = target * 4;

    let current = 0;
    let supCurrent = 0;
    let volCurrent = 0;

    const interval = setInterval(() => {
      const bump = Math.floor(Math.random() * 22) + 4;
      current = Math.min(current + bump, target);
      supCurrent = Math.min(supCurrent + (Math.random() > 0.7 ? 1 : 0), supTarget);
      volCurrent = Math.min(volCurrent + bump * 4, volTarget);

      setStats({
        raised: current,
        supporters: supCurrent,
        causeAmount: Math.round(current * 0.4),
        creatorAmount: Math.round(current * 0.2),
        volume: volCurrent,
      });

      if (current >= target) clearInterval(interval);
    }, 75);

    return () => clearInterval(interval);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(tokenUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareX = () => {
    const text = encodeURIComponent(
      `${token.viralHook}\n\n${tokenUrl} #ImpactBags #Solana`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `${token.viralHook}\n\nTrade here 👉 ${tokenUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setProofImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="screen-enter space-y-5 pt-2">
      {/* Success banner */}
      <div
        className="launched-gradient rounded-2xl p-6 text-center space-y-2"
        style={{
          border: "1px solid rgba(61, 220, 132, 0.3)",
        }}
      >
        <div className="text-4xl mb-2">🎉</div>
        <div
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-syne)", color: "var(--green)" }}
        >
          {token.name} IS LIVE
        </div>
        <div
          className="text-sm"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          ${token.ticker} · Trading on Bags · Solana
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs mt-2"
          style={{
            background: "var(--green-bg)",
            color: "var(--green)",
            border: "1px solid var(--border-color)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span className="live-dot" />
          Live on-chain
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "Total raised",
            value: `$${stats.raised.toLocaleString()}`,
            color: "var(--green)",
          },
          {
            label: "Supporters",
            value: stats.supporters.toString(),
            color: "var(--gold)",
          },
          {
            label: "To cause wallet",
            value: `$${stats.causeAmount.toLocaleString()}`,
            color: "var(--blue)",
          },
          {
            label: "Your earnings",
            value: `$${stats.creatorAmount.toLocaleString()}`,
            color: "var(--purple)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="text-xs mb-1"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              {s.label}
            </div>
            <div
              className="stat-value"
              style={{ color: s.color, fontFamily: "var(--font-syne)" }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Fee flow visualizer */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          className="text-xs uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          Live fee flow
        </div>
        <div className="space-y-3">
          {[
            { label: "Cause wallet", pct: 40, color: "var(--green)", amount: stats.causeAmount },
            { label: "Holder cashback", pct: 30, color: "var(--gold)", amount: Math.round(stats.raised * 0.3) },
            { label: "Your earnings", pct: 20, color: "var(--blue)", amount: stats.creatorAmount },
            { label: "Platform", pct: 10, color: "var(--purple)", amount: Math.round(stats.raised * 0.1) },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div
                className="text-xs min-w-[120px]"
                style={{ color: "var(--text-muted)" }}
              >
                {f.label}
              </div>
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--bg-surface2)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${f.pct}%`, background: f.color }}
                />
              </div>
              <div
                className="text-xs min-w-[48px] text-right"
                style={{ color: f.color, fontFamily: "var(--font-mono)" }}
              >
                ${f.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proof upload */}
      <div>
        <div
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          Impact proof photos
        </div>

        {proofImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {proofImages.map((src, i) => (
              <div key={i} className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Proof ${i + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleProofUpload}
          className="hidden"
        />

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-xl py-4 text-sm flex flex-col items-center gap-1 transition-colors duration-150"
          style={{
            background: "var(--bg-surface2)",
            border: "2px dashed var(--border-color)",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-muted)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-color)";
          }}
        >
          <span className="text-xl">📷</span>
          <span>Upload proof of impact</span>
          <span className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
            Solar panels installed? Kids in school? Show it.
          </span>
        </button>
      </div>

      {/* Share */}
      <div>
        <div
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          Share &amp; go viral
        </div>

        {/* Token link */}
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3 mb-3"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
          }}
        >
          <span
            className="flex-1 text-sm truncate"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
          >
            {tokenUrl}
          </span>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors duration-150"
            style={{
              background: copied ? "var(--green-bg)" : "var(--bg-surface2)",
              color: copied ? "var(--green)" : "var(--text-muted)",
              border: "1px solid var(--border-color)",
              cursor: "pointer",
            }}
          >
            <Copy size={12} />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "𝕏", label: "Post on X", action: shareX },
            { icon: "💬", label: "WhatsApp", action: shareWhatsApp },
            {
              icon: "🔗",
              label: "Copy link",
              action: copyLink,
            },
            {
              icon: "📱",
              label: "QR Code",
              action: () =>
                alert(
                  `In production: generate QR for ${tokenUrl} — perfect for printed flyers!`
                ),
            },
          ].map((s) => (
            <button
              key={s.label}
              onClick={s.action}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all duration-150"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "var(--gold)";
                el.style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "var(--border-color)";
                el.style.color = "var(--text-muted)";
              }}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bags SDK integration note */}
      <div
        className="rounded-xl p-4 text-xs space-y-2"
        style={{
          background: "var(--bg-surface2)",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          lineHeight: "1.8",
        }}
      >
        <div className="font-medium" style={{ color: "var(--text-secondary)" }}>
          Bags SDK integration (add in production):
        </div>
        <pre
          className="text-xs overflow-x-auto"
          style={{ color: "var(--green)", whiteSpace: "pre-wrap" }}
        >{`await bagsSDK.launchToken({
  name: "${token.name}",
  ticker: "${token.ticker}",
  feeShares: {
    cause: "0.40",
    holders: "0.30",
    creator: "0.20",
    platform: "0.10"
  }
})`}</pre>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="btn-outline w-full py-3 text-sm flex items-center justify-center gap-2"
      >
        <Plus size={15} />
        Launch another cause
      </button>
    </div>
  );
}
