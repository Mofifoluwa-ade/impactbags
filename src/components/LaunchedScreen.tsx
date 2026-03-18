"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Share2, MessageCircle, Link2, QrCode, Camera, PlusCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { useAnimatedCounter } from "@/lib/useAnimatedCounter";
import type { GeneratedToken } from "@/types";
import { buildShareX, buildShareWhatsApp, cn } from "@/lib/utils";

export function LaunchedScreen({ token, onLaunchAnother }: { token: GeneratedToken; onLaunchAnother: () => void }) {
  const [targetRaised, setTargetRaised] = useState(0);
  const [targetSup, setTargetSup] = useState(0);
  const raised = useAnimatedCounter(targetRaised, 1400);
  const sup = useAnimatedCounter(targetSup, 1200);
  const causeAmt = Math.round(raised * 0.4);
  const creatorAmt = Math.round(raised * 0.2);

  useEffect(() => {
    const r = Math.floor(Math.random() * 600) + 200;
    setTargetRaised(r);
    setTargetSup(Math.floor(r / 9));
    const iv = setInterval(() => {
      setTargetRaised(p => p + Math.floor(Math.random() * 14) + 2);
      setTargetSup(p => Math.random() > 0.7 ? p + 1 : p);
    }, 1800);
    return () => clearInterval(iv);
  }, []);

  const STATS = [
    { label: "Total raised", value: `$${raised.toLocaleString()}`, color: "text-brand-green" },
    { label: "Supporters", value: sup.toString(), color: "text-brand-gold" },
    { label: "To cause wallet", value: `$${causeAmt.toLocaleString()}`, color: "text-gray-900 dark:text-gray-100" },
    { label: "Your earnings", value: `$${creatorAmt.toLocaleString()}`, color: "text-gray-900 dark:text-gray-100" },
  ];

  return (
    <motion.div key="launched" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left */}
        <div className="flex flex-col gap-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-2xl p-5 text-center bg-gradient-to-br from-brand-green/10 to-brand-green/5 border border-brand-green/30 dark:border-brand-green/20">
            <div className="text-4xl mb-2">🎉</div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle2 size={18} className="text-brand-green" />
              <h2 className="font-syne text-xl font-extrabold text-brand-green">{token.name.toUpperCase()} IS LIVE</h2>
            </div>
            <div className="font-mono text-sm text-gray-500 dark:text-gray-500">${token.ticker} · Trading on Bags / Solana</div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green/20 text-brand-green text-xs font-medium">
              <TrendingUp size={12} /> Live volume counts toward hackathon ranking
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }} className="rounded-2xl p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                <div className="text-[11px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1.5 font-medium">{s.label}</div>
                <div className={cn("font-syne text-2xl font-extrabold", s.color)}>{s.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Progress */}
          <div className="rounded-2xl p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mb-2">
              <span>Cause progress</span>
              <span className="font-mono text-brand-green">${causeAmt} funded</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-light-surface2 dark:bg-dark-surface2 overflow-hidden">
              <motion.div className="h-full rounded-full bg-brand-green" initial={{ width: 0 }} animate={{ width: `${Math.min((causeAmt / 1000) * 100, 100)}%` }} transition={{ duration: 1.2, ease: "easeOut" }} />
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600 mt-1.5">Goal: $1,000 · {token.causeWallet}</div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          {/* Proof upload */}
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide font-medium mb-2">Upload proof of impact</p>
            <button onClick={() => alert("In production: opens camera → uploads to IPFS → pins as verified proof on your token dashboard")} className="w-full rounded-2xl border-2 border-dashed border-light-border dark:border-dark-border p-6 text-center hover:border-brand-gold/50 hover:bg-brand-gold/5 bg-light-surface2 dark:bg-dark-surface2 transition-all duration-200">
              <Camera size={22} className="mx-auto mb-2 text-gray-400 dark:text-gray-600" />
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Add proof photos</div>
              <div className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">Builds trust with holders → more trading volume</div>
            </button>
          </div>

          {/* Share */}
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide font-medium mb-2">Share &amp; go viral</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: buildShareX(token.viralHook, token.ticker), icon: Share2, label: "Post on X" },
                { href: buildShareWhatsApp(token.viralHook, token.ticker), icon: MessageCircle, label: "WhatsApp" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className={cn("flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium", "bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border", "text-gray-600 dark:text-gray-400 hover:border-brand-gold/50 hover:text-brand-gold transition-all")}>
                  <s.icon size={14} />{s.label}
                </a>
              ))}
              <button onClick={() => { navigator.clipboard.writeText(`https://bags.fm/token/${token.ticker}`); }} className={cn("flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium", "bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border", "text-gray-600 dark:text-gray-400 hover:border-brand-gold/50 hover:text-brand-gold transition-all")}>
                <Link2 size={14} />Copy link
              </button>
              <button onClick={() => alert(`QR for bags.fm/token/${token.ticker}`)} className={cn("flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium", "bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border", "text-gray-600 dark:text-gray-400 hover:border-brand-gold/50 hover:text-brand-gold transition-all")}>
                <QrCode size={14} />QR Code
              </button>
            </div>
          </div>

          <button onClick={onLaunchAnother} className="btn-outline w-full py-3.5 text-sm flex items-center justify-center gap-2">
            <PlusCircle size={16} />Launch another cause
          </button>
        </div>
      </div>
    </motion.div>
  );
}
