"use client";

import { LIVE_LAUNCHES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TickerBar() {
  const items = [...LIVE_LAUNCHES, ...LIVE_LAUNCHES, ...LIVE_LAUNCHES];

  return (
    <div
      className={cn(
        "w-full overflow-hidden py-2.5 px-4 rounded-xl",
        "bg-light-surface dark:bg-dark-surface",
        "border border-light-border dark:border-dark-border"
      )}
    >
      <div className="flex gap-10 ticker-scroll w-max">
        {items.map((item, i) => (
          <span key={i} className="ticker-item flex items-center gap-2">
            <span>{item.emoji}</span>
            <span className="font-mono text-xs font-medium text-brand-gold">
              {item.ticker}
            </span>
            <span className="text-gray-400 dark:text-gray-600 text-xs">
              ${item.raised.toLocaleString()} raised
            </span>
            <span
              className={cn(
                "text-xs font-mono",
                item.change24h >= 0
                  ? "text-brand-green"
                  : "text-red-500 dark:text-red-400"
              )}
            >
              {item.change24h >= 0 ? "+" : ""}
              {item.change24h}%
            </span>
            <span className="text-gray-200 dark:text-gray-800 mx-2">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
