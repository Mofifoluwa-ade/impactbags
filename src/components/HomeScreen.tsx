"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { TickerBar } from "@/components/TickerBar";
import { LiveLaunchesList } from "@/components/LiveLaunchesList";
import { EXAMPLE_CAUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HomeScreenProps {
  onGenerate: (cause: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function HomeScreen({ onGenerate, isLoading, error }: HomeScreenProps) {
  const [cause, setCause] = useState("");
  const MAX = 200;

  const handleSubmit = () => {
    if (cause.trim().length < 5) return;
    onGenerate(cause.trim());
  };

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      {/* Ticker */}
      <TickerBar />

      {/* Hero */}
      <div>
        <h1 className="font-syne text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900 dark:text-gray-50">
          Turn your cause into a{" "}
          <span className="text-brand-gold">token</span>{" "}
          in 60 seconds.
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
          Type your idea → AI builds it → Launch on Bags → Fees fund your community.
          No code. No bank. No excuses.
        </p>
      </div>

      {/* Examples */}
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-600 mb-2 font-medium uppercase tracking-wide">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_CAUSES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setCause(ex.text)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs",
                "bg-light-surface dark:bg-dark-surface",
                "border border-light-border dark:border-dark-border",
                "text-gray-500 dark:text-gray-500",
                "hover:border-brand-gold/60 hover:text-brand-gold",
                "transition-all duration-150"
              )}
            >
              <span>{ex.emoji}</span>
              <span className="hidden sm:inline truncate max-w-[140px]">
                {ex.text.split(" ").slice(0, 5).join(" ")}…
              </span>
              <span className="sm:hidden">{ex.text.split(" ").slice(3, 6).join(" ")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text input */}
      <div
        className={cn(
          "rounded-2xl overflow-hidden",
          "bg-light-surface dark:bg-dark-surface",
          "border border-light-border dark:border-dark-border",
          "focus-within:border-brand-gold/50 transition-colors duration-200"
        )}
      >
        <textarea
          value={cause}
          onChange={(e) => setCause(e.target.value.slice(0, MAX))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
          }}
          placeholder='Describe your cause… e.g. "Fund solar panels for my street in Port Harcourt"'
          className="input-field p-4 min-h-[96px]"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-light-border dark:border-dark-border">
          <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">
            {cause.length} / {MAX}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-600">
            AI handles the rest ✦ · <kbd className="text-[10px] px-1 py-0.5 rounded bg-light-surface2 dark:bg-dark-surface2">⌘ Enter</kbd>
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm"
        >
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || cause.trim().length < 5}
        className="btn-gold w-full py-4 text-base tracking-wide flex items-center justify-center gap-2"
      >
        <Sparkles size={18} />
        {isLoading ? "Generating…" : "Generate My Token"}
      </button>

      {/* Live launches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400 dark:text-gray-600 font-medium uppercase tracking-wide">
            Live launches
          </p>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-brand-green"
              style={{ animation: "pulseDot 1.5s ease-in-out infinite" }}
            />
            <span className="text-xs font-mono text-brand-green">LIVE</span>
          </div>
        </div>
        <div className="card p-4 rounded-2xl">
          <LiveLaunchesList />
        </div>
      </div>
    </motion.div>
  );
}
