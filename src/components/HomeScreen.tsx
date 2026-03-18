"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { TickerBar } from "@/components/TickerBar";
import { EXAMPLE_CAUSES, LIVE_LAUNCHES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HomeScreenProps {
  onGenerate: (cause: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function HomeScreen({ onGenerate, isLoading, error }: HomeScreenProps) {
  const [cause, setCause] = useState("");
  const MAX = 200;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* LEFT: Input panel */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex flex-col gap-5">
        <div>
          <h1 className="font-syne text-3xl xl:text-4xl font-extrabold leading-tight text-gray-900 dark:text-gray-50">
            Turn any cause into a <span className="text-brand-gold">token</span> in 60 seconds.
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
            Type your idea → AI builds it → Launch on Bags → Fees fund your community. No code. No bank. No borders.
          </p>
        </div>

        {/* Examples */}
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-600 mb-2 font-medium uppercase tracking-wide">Try an example</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_CAUSES.map((ex, i) => (
              <button key={i} onClick={() => setCause(ex.text)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs", "bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border", "text-gray-500 dark:text-gray-500 hover:border-brand-gold/60 hover:text-brand-gold transition-all duration-150")}>
                <span>{ex.emoji}</span>
                <span className="hidden sm:inline">{ex.text.split(" ").slice(0, 5).join(" ")}…</span>
                <span className="sm:hidden">{ex.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className={cn("rounded-2xl overflow-hidden bg-light-surface dark:bg-dark-surface", "border border-light-border dark:border-dark-border focus-within:border-brand-gold/50 transition-colors duration-200")}>
          <textarea
            value={cause}
            onChange={(e) => setCause(e.target.value.slice(0, MAX))}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && cause.trim().length >= 5) onGenerate(cause.trim()); }}
            placeholder='Describe your cause… e.g. "Solar panels for 200 homes in rural Ethiopia"'
            className="w-full bg-transparent outline-none resize-none text-gray-900 dark:text-gray-100 font-dm text-[15px] placeholder:text-gray-400 dark:placeholder:text-gray-600 p-4 min-h-[100px]"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-light-border dark:border-dark-border">
            <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">{cause.length} / {MAX}</span>
            <span className="text-xs text-gray-400 dark:text-gray-600">⌘ Enter to generate</span>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <button
          onClick={() => onGenerate(cause.trim())}
          disabled={isLoading || cause.trim().length < 5}
          className="btn-gold w-full py-4 text-base tracking-wide flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles size={18} />
          {isLoading ? "Generating…" : "Generate My Token"}
        </button>
      </motion.div>

      {/* RIGHT: Live launches panel */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="flex flex-col gap-4">
        <TickerBar />

        <div className={cn("rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border overflow-hidden")}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-light-border dark:border-dark-border">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-600">Live launches</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green" style={{ animation: "pulseDot 1.5s ease-in-out infinite" }} />
              <span className="text-xs font-mono text-brand-green">LIVE</span>
            </div>
          </div>
          <div className="divide-y divide-light-border dark:divide-dark-border">
            {LIVE_LAUNCHES.map((l) => (
              <div key={l.id} className="flex items-center gap-3 px-4 py-3 hover:bg-light-surface2 dark:hover:bg-dark-surface2 transition-colors">
                <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-light-surface2 dark:bg-dark-surface2 flex items-center justify-center text-lg">{l.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{l.name}</span>
                    <span className="font-mono text-xs text-brand-gold flex-shrink-0">{l.ticker}</span>
                    <span className="text-xs flex-shrink-0">{l.country}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 truncate mt-0.5">{l.cause}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-sm font-medium text-brand-green">${l.raised.toLocaleString()}</div>
                  <div className={cn("flex items-center justify-end gap-0.5 text-xs", l.change24h >= 0 ? "text-brand-green" : "text-red-400")}>
                    {l.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span>{l.change24h >= 0 ? "+" : ""}{l.change24h}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
