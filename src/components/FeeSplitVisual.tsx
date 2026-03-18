"use client";

import { FEE_SPLITS } from "@/lib/constants";
import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeeSplitVisual() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div>
      {/* Stacked bar */}
      <div className="flex w-full h-3 rounded-full overflow-hidden mb-5 gap-0.5">
        {FEE_SPLITS.map((fee, i) => (
          <div
            key={i}
            className="h-full transition-all duration-200 cursor-pointer"
            style={{
              width: `${fee.pct}%`,
              backgroundColor: fee.color,
              opacity: activeIndex === null || activeIndex === i ? 1 : 0.35,
            }}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          />
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3">
        {FEE_SPLITS.map((fee, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 cursor-default transition-opacity duration-150",
              activeIndex !== null && activeIndex !== i && "opacity-40"
            )}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Dot */}
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: fee.color }}
            />

            {/* Label */}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {fee.label}
              </div>
              {activeIndex === i && (
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 animate-[fadeUp_0.2s_ease]">
                  {fee.description}
                </div>
              )}
            </div>

            {/* Bar */}
            <div className="fee-bar-bg w-24 hidden sm:flex">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${fee.pct}%`,
                  backgroundColor: fee.color,
                }}
              />
            </div>

            {/* Pct */}
            <div
              className="font-mono text-sm font-medium w-8 text-right"
              style={{ color: fee.color }}
            >
              {fee.pct}%
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-600">
        <Info size={12} className="flex-shrink-0 mt-0.5" />
        <span>Fee split applied on every trade. No smart contracts needed — Bags SDK handles it.</span>
      </div>
    </div>
  );
}
