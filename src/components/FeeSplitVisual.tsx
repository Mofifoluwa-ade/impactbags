"use client";
import { FEE_SPLITS } from "@/lib/constants";
import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeeSplitVisual() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  return (
    <div>
      <div className="flex w-full h-2.5 rounded-full overflow-hidden mb-4 gap-0.5">
        {FEE_SPLITS.map((f, i) => (
          <div key={i} className="h-full transition-all duration-200 cursor-pointer" style={{ width: `${f.pct}%`, backgroundColor: f.color, opacity: activeIdx === null || activeIdx === i ? 1 : 0.3 }} onMouseEnter={() => setActiveIdx(i)} onMouseLeave={() => setActiveIdx(null)} />
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {FEE_SPLITS.map((f, i) => (
          <div key={i} className={cn("flex items-center gap-3 cursor-default transition-opacity duration-150", activeIdx !== null && activeIdx !== i && "opacity-40")} onMouseEnter={() => setActiveIdx(i)} onMouseLeave={() => setActiveIdx(null)}>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{f.label}</div>
              {activeIdx === i && <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{f.description}</div>}
            </div>
            <div className="hidden sm:block flex-1 bg-light-surface2 dark:bg-dark-surface2 rounded-full h-1.5 max-w-[100px]">
              <div className="h-full rounded-full" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
            </div>
            <div className="font-mono text-sm font-medium w-8 text-right" style={{ color: f.color }}>{f.pct}%</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-600">
        <Info size={12} className="flex-shrink-0 mt-0.5" />
        <span>Split applies on every on-chain trade. Bags SDK handles it automatically — no smart contracts required.</span>
      </div>
    </div>
  );
}
