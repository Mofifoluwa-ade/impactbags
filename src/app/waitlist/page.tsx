"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  ArrowRight, CheckCircle2, Sparkles, Globe,
  Zap, Shield, Users, Mail,
} from "lucide-react";

const ROLES = [
  { value: "builder",    label: "🏗️  Builder / Developer" },
  { value: "community",  label: "🌍  Community Organiser" },
  { value: "investor",   label: "💰  Investor / DAO" },
  { value: "creator",    label: "🎨  Content Creator" },
  { value: "other",      label: "✦   Other" },
];

const REFERRALS = [
  "Twitter / X", "WhatsApp", "Friend / Word of mouth",
  "Bags Hackathon", "GitHub", "Other",
];

const PERKS = [
  { icon: Zap,     title: "Early access",   desc: "Launch tokens before anyone else when we go live." },
  { icon: Shield,  title: "Founding badge",  desc: "On-chain proof you were here from day one." },
  { icon: Globe,   title: "Fee boost",       desc: "Early launchers get a 5% fee share bonus for 90 days." },
  { icon: Users,   title: "Private community", desc: "Access to our private Discord for builders and organisers." },
];

interface FormState {
  name: string;
  email: string;
  role: string;
  cause: string;
  referral: string;
}

export default function WaitlistPage() {
  const [form, setForm]     = useState<FormState>({ name: "", email: "", role: "", cause: "", referral: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState<string | null>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError(null);
    if (!form.name.trim())  return setError("Please enter your name.");
    if (!form.email.trim()) return setError("Please enter your email.");
    if (!form.role)         return setError("Please select your role.");

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setPosition(data.position);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">

      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-light-border dark:border-dark-border">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-gold/20 flex items-center justify-center">
              <span className="text-brand-gold text-sm">⚡</span>
            </div>
            <span className="font-syne font-extrabold text-base">
              <span className="text-brand-gold">Impact</span>
              <span className="text-brand-green">Bags</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: copy ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 mb-5 font-medium">
              <Sparkles size={11} /> Now accepting early access
            </div>

            <h1 className="font-syne text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight mb-5">
              Be first to launch a community impact token.
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
              ImpactBags is in private beta. Join the waitlist and get early access, a founding member badge, and a fee boost when we launch publicly on Solana.
            </p>

            {/* Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {PERKS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-2xl",
                    "bg-light-surface dark:bg-dark-surface",
                    "border border-light-border dark:border-dark-border"
                  )}
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <p.icon size={16} className="text-brand-gold" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{p.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 leading-relaxed">{p.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social proof counter */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-green/5 border border-brand-green/20">
              <div className="flex -space-x-2">
                {["🧑🏿", "👩🏽", "👨🏻", "👩🏾", "🧑🏼"].map((e, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-light-surface dark:bg-dark-surface border-2 border-light-bg dark:border-dark-bg flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Join the growing list
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Builders, community leaders &amp; DAOs signing up daily</div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: form / success ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <AnimatePresence mode="wait">
              {success ? (
                /* Success state */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className={cn(
                    "rounded-3xl p-8 text-center",
                    "bg-light-surface dark:bg-dark-surface",
                    "border border-light-border dark:border-dark-border"
                  )}
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mx-auto mb-5 border border-brand-green/20">
                    <CheckCircle2 size={32} className="text-brand-green" />
                  </div>
                  <h2 className="font-syne text-2xl font-extrabold text-gray-900 dark:text-gray-50 mb-2">
                    You&apos;re on the list! 🎉
                  </h2>
                  <p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed mb-6">
                    We&apos;ll email you the moment early access opens. In the meantime, share the waitlist with your community to move up the queue.
                  </p>

                  <div className="flex flex-col gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just joined the @ImpactBags waitlist — launch community impact tokens on Solana in 60 seconds. Join me: " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2"
                    >
                      Share on X to move up the queue
                    </a>
                    <Link href="/" className="btn-outline w-full py-3 text-sm flex items-center justify-center gap-2">
                      Back to ImpactBags <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                /* Form */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "rounded-3xl p-6 sm:p-8",
                    "bg-light-surface dark:bg-dark-surface",
                    "border border-light-border dark:border-dark-border"
                  )}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                      <Mail size={16} className="text-brand-gold" />
                    </div>
                    <div>
                      <h2 className="font-syne text-lg font-extrabold text-gray-900 dark:text-gray-50">Request early access</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Takes 30 seconds</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        Full name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Your name"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl text-sm outline-none",
                          "bg-light-surface2 dark:bg-dark-surface2",
                          "border border-light-border dark:border-dark-border",
                          "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "focus:border-brand-gold/50 transition-colors"
                        )}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        Email address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="you@example.com"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl text-sm outline-none",
                          "bg-light-surface2 dark:bg-dark-surface2",
                          "border border-light-border dark:border-dark-border",
                          "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "focus:border-brand-gold/50 transition-colors"
                        )}
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        I am a… <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={form.role}
                        onChange={set("role")}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none",
                          "bg-light-surface2 dark:bg-dark-surface2",
                          "border border-light-border dark:border-dark-border",
                          "text-gray-900 dark:text-gray-100",
                          "focus:border-brand-gold/50 transition-colors",
                          !form.role && "text-gray-400 dark:text-gray-600"
                        )}
                      >
                        <option value="" disabled>Select your role</option>
                        {ROLES.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Cause (optional) */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        What cause would you launch? <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        value={form.cause}
                        onChange={set("cause")}
                        placeholder="e.g. Solar panels for my village, school fees for 50 kids…"
                        rows={2}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl text-sm outline-none resize-none",
                          "bg-light-surface2 dark:bg-dark-surface2",
                          "border border-light-border dark:border-dark-border",
                          "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600",
                          "focus:border-brand-gold/50 transition-colors"
                        )}
                      />
                    </div>

                    {/* Referral (optional) */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                        How did you hear about us? <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <select
                        value={form.referral}
                        onChange={set("referral")}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none",
                          "bg-light-surface2 dark:bg-dark-surface2",
                          "border border-light-border dark:border-dark-border",
                          "text-gray-900 dark:text-gray-100",
                          "focus:border-brand-gold/50 transition-colors",
                          !form.referral && "text-gray-400 dark:text-gray-600"
                        )}
                      >
                        <option value="">Select source</option>
                        {REFERRALS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5"
                        >
                          ⚠ {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                          Joining…
                        </span>
                      ) : (
                        <>
                          Join the waitlist <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400 dark:text-gray-600">
                      No spam. Unsubscribe anytime.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
