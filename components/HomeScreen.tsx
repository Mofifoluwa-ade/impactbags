"use client";

import { useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { TickerBar } from "./TickerBar";
import { CAUSE_EXAMPLES, LIVE_LAUNCHES } from "@/lib/mock-data";

interface HomeScreenProps {
  causeText: string;
  setCauseText: (text: string) => void;
  onStartGenerating: () => void;
}

export function HomeScreen({
  causeText,
  setCauseText,
  onStartGenerating,
}: HomeScreenProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!causeText.trim()) {
      textareaRef.current?.focus();
      return;
    }
    onStartGenerating();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="screen-enter space-y-6 pt-2">
      {/* Ticker */}
      <TickerBar />

      {/* Hero */}
      <div className="hero-gradient rounded-2xl p-5 space-y-3">
        <div
          className="text-3xl sm:text-4xl font-extrabold leading-tight"
          style={{ fontFamily: "var(--font-syne)", color: "var(--text-primary)" }}
        >
          Turn your cause into a{" "}
          <span style={{ color: "var(--gold)" }}>token</span>{" "}
          in <span style={{ color: "var(--green)" }}>60 seconds.</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Type your idea → AI builds your token → Launch on Bags → Fees fund
          your community. No code, no bank, no wahala.
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-1">
          {[
            { label: "Tokens launched", value: "1,247" },
            { label: "Total raised", value: "$48k+" },
            { label: "Communities", value: "89" },
          ].map((s) => (
            <div key={s.label}>
              <div
                className="text-base font-bold"
                style={{ fontFamily: "var(--font-syne)", color: "var(--green)" }}
              >
                {s.value}
              </div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div>
        <div
          className="text-xs uppercase tracking-widest mb-2"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          Quick examples
        </div>
        <div className="flex flex-wrap gap-2">
          {CAUSE_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => {
                setCauseText(ex.text);
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-150"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-dm)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--gold)";
                el.style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--border-color)";
                el.style.color = "var(--text-muted)";
              }}
            >
              <span>{ex.emoji}</span>
              <span className="max-w-[140px] truncate">{ex.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div
        className="rounded-2xl overflow-hidden transition-all duration-200"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-card)",
        }}
        onFocus={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--gold)";
          el.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--gold) 15%, transparent)";
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            const el = e.currentTarget;
            el.style.borderColor = "var(--border-color)";
            el.style.boxShadow = "var(--shadow-card)";
          }
        }}
      >
        <textarea
          ref={textareaRef}
          value={causeText}
          onChange={(e) => {
            if (e.target.value.length <= 200) setCauseText(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder='Describe your cause in one sentence... e.g. "Launch a token to fund solar panels for my street in Port Harcourt"'
          className="w-full resize-none outline-none bg-transparent px-4 pt-4 pb-2 text-sm sm:text-base leading-relaxed"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-dm)",
            minHeight: "100px",
          }}
          rows={3}
        />
        <div
          className="flex items-center justify-between px-4 pb-3 pt-1 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <span
            className="text-xs"
            style={{
              color: causeText.length > 180 ? "var(--gold)" : "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {causeText.length} / 200
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            ⌘ + Enter to generate
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={!causeText.trim()}
        className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2"
        style={{ fontSize: "16px" }}
      >
        <Sparkles size={18} />
        Generate My Token
        <ArrowRight size={18} />
      </button>

      {/* How it works */}
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
          How it works
        </div>
        <div className="space-y-4">
          {[
            {
              step: "01",
              icon: "✍️",
              title: "Type your cause",
              desc: "One sentence is all you need. Solar panels, school fees, clean water — anything.",
            },
            {
              step: "02",
              icon: "✦",
              title: "AI builds it",
              desc: "Gets a catchy name, ticker, description and viral hook instantly.",
            },
            {
              step: "03",
              icon: "🚀",
              title: "Launch on Bags",
              desc: "Token goes live on Solana. Fees split automatically to your cause.",
            },
            {
              step: "04",
              icon: "💬",
              title: "Share & go viral",
              desc: "Drop the link on WhatsApp and X. Every trade = more money for the cause.",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm"
                style={{ background: "var(--bg-surface2)" }}
              >
                {item.icon}
              </div>
              <div>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.title}
                </div>
                <div
                  className="text-xs mt-0.5 leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live launches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
          >
            Live launches
          </div>
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}
          >
            <span className="live-dot" />
            Live
          </div>
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
          }}
        >
          {LIVE_LAUNCHES.map((launch, i) => (
            <div
              key={launch.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors duration-150"
              style={{
                borderBottom:
                  i < LIVE_LAUNCHES.length - 1
                    ? "1px solid var(--border-color)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "var(--bg-surface2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "transparent";
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: "var(--bg-surface2)" }}
              >
                {launch.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {launch.name}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      color: "var(--gold)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {launch.ticker}
                  </span>
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {launch.cause}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className="text-sm font-medium"
                  style={{
                    color: "var(--green)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ${launch.raised.toLocaleString()}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {launch.supporters} sup.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
