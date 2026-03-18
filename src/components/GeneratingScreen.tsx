"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["Reading your cause…", "Naming your token…", "Writing the pitch…", "Calculating fee splits…", "Finalising details…"];

export function GeneratingScreen() {
  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStepIdx(p => Math.min(p + 1, STEPS.length - 1)), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center min-h-[500px]">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full text-center">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-light-border dark:border-dark-border" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-gold animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-brand-green animate-spin" style={{ animationDuration: "0.6s", animationDirection: "reverse" }} />
        </div>
        <div>
          <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-gray-100">AI is cooking…</h2>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Building your community token</p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <AnimatePresence>
            {STEPS.slice(0, stepIdx + 1).map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                </span>
                <span className={`text-sm ${i === stepIdx ? "text-brand-green font-medium" : "text-gray-400 dark:text-gray-600"}`}>{s}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
