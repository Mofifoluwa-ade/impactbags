"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Share2, MessageCircle, Link2, QrCode, Camera,
  PlusCircle, CheckCircle2, TrendingUp,
} from "lucide-react";
import { useAnimatedCounter } from "@/lib/useAnimatedCounter";
import type { GeneratedToken, LaunchStats } from "@/types";
import { buildShareX, buildShareWhatsApp, cn } from "@/lib/utils";

interface LaunchedScreenProps {
  token: GeneratedToken;
  onLaunchAnother: () => void;
}

export function LaunchedScreen({ token, onLaunchAnother }: LaunchedScreenProps) {
  const [stats, setStats] = useState<LaunchStats>({
    raised: 0,
    supporters: 0,
    causeAmount: 0,
    creatorAmount: 0,
    volume24h: 0,
    txCount: 0,
  });
  const [targetRaised, setTargetRaised] = useState(0);
  const [targetSup, setTargetSup] = useState(0);

  const animatedRaised = useAnimatedCounter(targetRaised, 1400);
  const animatedSup = useAnimatedCounter(targetSup, 1200);

  // Simulate live fundraising
  useEffect(() => {
    const finalRaised = Math.floor(Math.random() * 600) + 200;
    const finalSup = Math.floor(finalRaised / 9);
    setTargetRaised(finalRaised);
    setTargetSup(finalSup);

    const interval = setInterval(() => {
      setTargetRaised((prev) => {
        const bump = Math.floor(Math.random() * 14) + 2;
        return prev + bump;
      });
      setTargetSup((prev) =>
        Math.random() > 0.7 ? prev + 1 : prev
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const causeAmount = Math.round(animatedRaised * 0.4);
  const creatorAmount = Math.round(animatedRaised * 0.2);

  const STAT_CARDS = [
    { label: "Total raised", value: `$${animatedRaised.toLocaleString()}`, color: "text-brand-green" },
    { label: "Supporters", value: animatedSup.toString(), color: "text-brand-gold" },
    { label: "To cause wallet", value: `$${causeAmount.toLocaleString()}`, color: "text-gray-900 dark:text-gray-100" },
    { label: "Your earnings", value: `$${creatorAmount.toLocaleString()}`, color: "text-gray-900 dark:text-gray-100" },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(`https://bags.fm/token/${token.ticker}`);
  };

  return (
    <motion.div
      key="launched"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4"
    >
      {/* Success banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className={cn(
          "rounded-2xl p-5 text-center",
          "bg-gradient-to-br from-brand-green/10 to-brand-green/5",
          "border border-brand-green/30 dark:border-brand-green/20"
        )}
      >
        <div className="text-4xl mb-2">🎉</div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle2 size={18} className="text-brand-green" />
          <h2 className="font-syne text-xl font-extrabold text-brand-green">
            {token.name.toUpperCase()} IS LIVE
          </h2>
        </div>
        <div className="font-mono text-sm text-gray-500 dark:text-gray-500">
          ${token.ticker} · Trading on Bags Solana
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green/20 text-brand-green text-xs font-medium">
          <TrendingUp size={12} />
          Live on-chain volume counts toward hackathon ranking
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {STAT_CARDS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="stat-card"
          >
            <div className="text-[11px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1.5 font-medium">
              {s.label}
            </div>
            <div className={cn("font-syne text-2xl font-extrabold", s.color)}>
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="card p-4 rounded-2xl">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mb-2">
          <span>Cause progress</span>
          <span className="font-mono text-brand-green">${causeAmount} funded</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-light-surface2 dark:bg-dark-surface2 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-brand-green"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((causeAmount / 1000) * 100, 100)}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-600 mt-1.5">
          Goal: $1,000 · {token.causeWallet}
        </div>
      </div>

      {/* Proof upload */}
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide font-medium mb-2">
          Upload proof of impact
        </p>
        <button
          onClick={() => alert("In production: opens camera → uploads to IPFS → pins to token dashboard as verified proof")}
          className={cn(
            "w-full rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-200",
            "border-light-border dark:border-dark-border",
            "hover:border-brand-gold/50 hover:bg-brand-gold/5",
            "bg-light-surface2 dark:bg-dark-surface2"
          )}
        >
          <Camera size={22} className="mx-auto mb-2 text-gray-400 dark:text-gray-600" />
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Add proof photos
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
            Solar panels installed? Kids in school? Show it. Builds trust = more volume.
          </div>
        </button>
      </div>

      {/* Share buttons */}
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide font-medium mb-2">
          Share &amp; go viral
        </p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={buildShareX(token.viralHook, token.ticker)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium",
              "bg-light-surface dark:bg-dark-surface",
              "border border-light-border dark:border-dark-border",
              "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
              "hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-150"
            )}
          >
            <Share2 size={14} />
            Post on X
          </a>
          <a
            href={buildShareWhatsApp(token.viralHook, token.ticker)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium",
              "bg-light-surface dark:bg-dark-surface",
              "border border-light-border dark:border-dark-border",
              "text-gray-600 dark:text-gray-400 hover:text-brand-green",
              "hover:border-brand-green/50 transition-all duration-150"
            )}
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
          <button
            onClick={copyLink}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium",
              "bg-light-surface dark:bg-dark-surface",
              "border border-light-border dark:border-dark-border",
              "text-gray-600 dark:text-gray-400 hover:text-brand-gold",
              "hover:border-brand-gold/50 transition-all duration-150"
            )}
          >
            <Link2 size={14} />
            Copy link
          </button>
          <button
            onClick={() => alert(`QR Code for:\nbags.fm/token/${token.ticker}\n\nIn production: renders inline QR via qrcode.react`)}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium",
              "bg-light-surface dark:bg-dark-surface",
              "border border-light-border dark:border-dark-border",
              "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
              "hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-150"
            )}
          >
            <QrCode size={14} />
            QR Code
          </button>
        </div>
      </div>

      <button
        onClick={onLaunchAnother}
        className={cn(
          "btn-outline w-full py-3.5 text-sm flex items-center justify-center gap-2 mt-1"
        )}
      >
        <PlusCircle size={16} />
        Launch another cause
      </button>
    </motion.div>
  );
}
