"use client";

import { useEffect, useState } from "react";
import { LIVE_LAUNCHES } from "@/lib/constants";
import type { LiveLaunch } from "@/types";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export function LiveLaunchesList() {
  const [launches, setLaunches] = useState<LiveLaunch[]>(LIVE_LAUNCHES);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLaunches((prev) =>
        prev.map((l) => ({
          ...l,
          raised: l.raised + Math.floor(Math.random() * 12),
          supporters:
            Math.random() > 0.8 ? l.supporters + 1 : l.supporters,
        }))
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      {launches.map((launch, i) => (
        <div
          key={launch.id}
          className={cn(
            "flex items-center gap-3 py-3",
            i < launches.length - 1 &&
              "border-b border-light-border dark:border-dark-border"
          )}
        >
          {/* Emoji icon */}
          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-light-surface2 dark:bg-dark-surface2 flex items-center justify-center text-lg">
            {launch.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {launch.name}
              </span>
              <span className="font-mono text-xs text-brand-gold flex-shrink-0">
                {launch.ticker}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 truncate mt-0.5">
              {launch.cause}
            </div>
          </div>

          {/* Stats */}
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-sm font-medium text-brand-green">
              ${launch.raised.toLocaleString()}
            </div>
            <div
              className={cn(
                "flex items-center justify-end gap-0.5 text-xs",
                launch.change24h >= 0
                  ? "text-brand-green"
                  : "text-red-500 dark:text-red-400"
              )}
            >
              {launch.change24h >= 0 ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              <span>
                {launch.change24h >= 0 ? "+" : ""}
                {launch.change24h}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
