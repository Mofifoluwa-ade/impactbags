"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { LiveToken } from "@/types/token";

export function TickerBar() {
  const [tokens, setTokens] = useState<LiveToken[]>([]);

  useEffect(() => {
    const load = () =>
      fetch("/api/tokens")
        .then((r) => r.json())
        .then((d) => { if (d.tokens?.length) setTokens(d.tokens); })
        .catch(() => {});
    load();
    const iv = setInterval(load, 30_000);
    return () => clearInterval(iv);
  }, []);

  if (!tokens.length) {
    return (
      <div className={cn("w-full py-2.5 px-4 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs text-gray-400 dark:text-gray-600 font-mono")}>
        No tokens launched yet — be the first ✦
      </div>
    );
  }

  const items = [...tokens, ...tokens, ...tokens];
  return (
    <div className={cn("w-full overflow-hidden py-2.5 px-4 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border")}>
      <div className="flex gap-10 ticker-scroll w-max">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap">
            <span>{item.emoji}</span>
            <span className="font-mono text-xs font-medium text-brand-gold">${item.ticker}</span>
            <span className="text-xs text-gray-400 dark:text-gray-600">${item.raised.toLocaleString()}</span>
            <span className={cn("text-xs font-mono", item.change24h >= 0 ? "text-brand-green" : "text-red-400")}>
              {item.change24h >= 0 ? "+" : ""}{item.change24h.toFixed(1)}%
            </span>
            {item.country && <span>{item.country}</span>}
            <span className="text-gray-200 dark:text-gray-800">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
