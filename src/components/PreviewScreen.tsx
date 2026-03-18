"use client";
import { motion } from "framer-motion";
import { ChevronLeft, Rocket, RefreshCw, Tag, Wallet, Zap } from "lucide-react";
import { FeeSplitVisual } from "@/components/FeeSplitVisual";
import type { GeneratedToken } from "@/types";
import { cn } from "@/lib/utils";

interface PreviewScreenProps {
  token: GeneratedToken;
  onLaunch: () => void;
  onBack: () => void;
  onRegenerate: () => void;
}

export function PreviewScreen({ token, onLaunch, onBack, onRegenerate }: PreviewScreenProps) {
  return (
    <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-5">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: token card */}
        <div className="flex flex-col gap-4">
          <div className={cn("rounded-2xl p-5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border")}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-light-surface2 dark:bg-dark-surface2 flex items-center justify-center text-4xl">{token.emoji || "🌍"}</div>
              <div className="flex-1 min-w-0">
                <h2 className="font-syne text-2xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight">{token.name}</h2>
                <div className="font-mono text-sm text-brand-gold mt-1">${token.ticker}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-light-border dark:border-dark-border pt-4 mb-4">{token.description}</p>
            {token.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {token.tags.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-light-surface2 dark:bg-dark-surface2 text-gray-500 dark:text-gray-500 border border-light-border dark:border-dark-border">
                    <Tag size={9} />{tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-start gap-2 bg-brand-green/10 dark:bg-brand-green/5 rounded-xl p-3 border border-brand-green/20">
              <Wallet size={14} className="text-brand-green flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-brand-green font-medium uppercase tracking-wide mb-0.5">Cause wallet funds</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{token.causeWallet}</div>
              </div>
            </div>
          </div>

          <div className={cn("rounded-2xl p-4 bg-light-surface dark:bg-dark-surface border border-brand-gold/30")}>
            <div className="text-xs text-brand-gold font-medium uppercase tracking-wide mb-2">Viral share hook</div>
            <blockquote className="text-sm text-gray-700 dark:text-gray-300 italic border-l-2 border-brand-gold pl-3 leading-relaxed">{token.viralHook}</blockquote>
          </div>
        </div>

        {/* Right: fee split + actions */}
        <div className="flex flex-col gap-4">
          <div className={cn("rounded-2xl p-5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border")}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-brand-gold" />
              <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">Fee split on every trade</h3>
            </div>
            <FeeSplitVisual />
          </div>

          <button onClick={onLaunch} className="btn-green w-full py-4 text-lg flex items-center justify-center gap-2">
            <Rocket size={20} /> LAUNCH ON BAGS
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onRegenerate} className={cn("flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-medium", "bg-light-surface2 dark:bg-dark-surface2 border border-light-border dark:border-dark-border", "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all")}>
              <RefreshCw size={14} /> Regenerate
            </button>
            <button onClick={onBack} className="btn-outline py-3 text-sm">Edit cause</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
