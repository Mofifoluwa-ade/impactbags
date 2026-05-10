"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LiveToken } from "@/types/token";

export function LiveLaunchesList() {
  const [tokens, setTokens] = useState<LiveToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/tokens");
        const data = await res.json();
        setTokens(data.tokens ?? []);
      } catch {}
      finally { setLoading(false); }
    };
    load();
    const iv = setInterval(load, 15_000);
    return () => clearInterval(iv);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-gray-400 dark:text-gray-600">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm">Loading live launches…</span>
      </div>
    );
  }

  if (!tokens.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-3xl mb-3">🚀</div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No tokens launched yet.</p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Be the first to launch a community impact token.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-light-border dark:divide-dark-border">
      {tokens.map((token) => (
        <div key={token.id} className="flex items-center gap-3 py-3 hover:bg-light-surface2 dark:hover:bg-dark-surface2 transition-colors px-1 rounded-xl">
          <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-light-surface2 dark:bg-dark-surface2 flex items-center justify-center text-lg">
            {token.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{token.name}</span>
              <span className="font-mono text-xs text-brand-gold flex-shrink-0">${token.ticker}</span>
              {token.country && <span className="text-xs flex-shrink-0">{token.country}</span>}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 truncate mt-0.5">{token.causeWallet}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-sm font-medium text-brand-green">${token.raised.toLocaleString()}</div>
            <div className={cn("flex items-center justify-end gap-0.5 text-xs", token.change24h >= 0 ? "text-brand-green" : "text-red-400")}>
              {token.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>{token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
