"use client";

import { LIVE_LAUNCHES } from "@/lib/mock-data";

export function TickerBar() {
  const items = [...LIVE_LAUNCHES, ...LIVE_LAUNCHES];

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-center">
        {/* Label */}
        <div
          className="flex-shrink-0 px-3 py-2 text-xs font-medium border-r"
          style={{
            color: "var(--green)",
            borderColor: "var(--border-color)",
            background: "var(--green-bg)",
            fontFamily: "var(--font-mono)",
          }}
        >
          LIVE
        </div>
        {/* Scrolling content */}
        <div className="overflow-hidden flex-1 py-2 px-3">
          <div className="ticker-track">
            {items.map((l, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                }}
              >
                <span>{l.emoji}</span>
                <span style={{ color: "var(--gold)" }}>{l.ticker}</span>
                <span style={{ color: "var(--green)" }}>{l.change}</span>
                <span
                  style={{
                    color: "var(--border-hover)",
                    margin: "0 8px",
                  }}
                >
                  ·
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
