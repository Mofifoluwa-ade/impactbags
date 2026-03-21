"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthModal } from "@/components/AuthModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TickerBar } from "@/components/TickerBar";
import { STATS, HOW_IT_WORKS, CATEGORIES, LIVE_LAUNCHES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ConnectedUser } from "@/types";
import {
  Wallet, ArrowRight, Zap, Globe, Shield, TrendingUp,
  ExternalLink, ChevronRight, Star, Users, Activity,
} from "lucide-react";

function Navbar({ user, onConnect, onDisconnect }: { user: ConnectedUser | null; onConnect: () => void; onDisconnect: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={cn("w-full fixed top-0 z-30 transition-all duration-300", scrolled ? "bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-light-border dark:border-dark-border" : "bg-transparent")}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-brand-gold/20 flex items-center justify-center">
            <span className="text-brand-gold text-lg">⚡</span>
          </div>
          <span className="font-syne text-lg font-extrabold">
            <span className="text-brand-gold">Impact</span>
            <span className="text-brand-green">Bags</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[["#how-it-works", "How it works"], ["#launches", "Launches"], ["#categories", "Categories"]].map(([href, label]) => (
            <a key={href} href={href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">{label}</a>
          ))}
          <Link href="/docs" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Docs
          </Link>
          <a href="https://dev.bags.fm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            Bags <ExternalLink size={11} />
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/launch" className="btn-gold px-4 py-2 text-sm flex items-center gap-1.5">
                Launch token <ArrowRight size={14} />
              </Link>
              <button onClick={onDisconnect} className={cn("hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs", "bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border", "text-gray-500 hover:text-red-500 transition-colors")}>
                {user.displayName}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={onConnect} className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors px-3 py-2">
                Sign in
              </button>
              <button onClick={onConnect} className="btn-gold px-4 py-2 text-sm flex items-center gap-1.5">
                <Wallet size={14} /> Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function HeroSection({ onConnect, user }: { onConnect: () => void; user: ConnectedUser | null }) {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-gold/5 dark:bg-brand-gold/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-brand-green/5 dark:bg-brand-green/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-8xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-xs text-gray-500 dark:text-gray-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green" style={{ animation: "pulseDot 1.5s ease-in-out infinite" }} />
            Built on Solana · Powered by Bags SDK · AI by Claude
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="font-syne text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-gray-900 dark:text-gray-50 mb-6">
            Launch a community{" "}
            <span className="text-brand-gold">impact token</span>{" "}
            in 60 seconds.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            Type your cause — AI names your token — launch on Solana. Every trade auto-splits fees to fund solar panels, schools, clean water, and more. No code. No bank. No borders.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Link href="/launch" className="btn-gold px-8 py-4 text-base flex items-center gap-2 w-full sm:w-auto justify-center">
                ✦ Launch your token <ArrowRight size={18} />
              </Link>
            ) : (
              <button onClick={onConnect} className="btn-gold px-8 py-4 text-base flex items-center gap-2 w-full sm:w-auto justify-center">
                <Wallet size={18} /> Connect & get started
              </button>
            )}
            <a href="#how-it-works" className={cn("flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium w-full sm:w-auto justify-center", "bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border", "text-gray-600 dark:text-gray-400 hover:border-brand-gold/40 hover:text-gray-900 dark:hover:text-gray-100 transition-all")}>
              See how it works <ChevronRight size={16} />
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }} className="flex items-center justify-center gap-6 mt-10 flex-wrap">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-syne text-2xl font-extrabold text-gray-900 dark:text-gray-50">{s.value}{s.suffix}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Ticker */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-12 max-w-5xl mx-auto">
          <TickerBar />
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-medium uppercase tracking-wider text-brand-gold mb-3 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20">How it works</div>
          <h2 className="font-syne text-4xl font-extrabold text-gray-900 dark:text-gray-50">Three steps, real impact.</h2>
          <p className="text-gray-500 dark:text-gray-500 mt-3 max-w-xl mx-auto">Anyone anywhere can launch a cause token in minutes. No technical knowledge required.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className={cn("rounded-2xl p-6 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border relative overflow-hidden group hover:border-brand-gold/30 transition-all duration-300")}>
              <div className="absolute top-4 right-4 font-syne text-5xl font-extrabold text-gray-100 dark:text-gray-800 select-none group-hover:text-brand-gold/10 transition-colors">
                {step.step}
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
                  {[<Zap size={18} className="text-brand-gold" />, <Star size={18} className="text-brand-gold" />, <Activity size={18} className="text-brand-gold" />, <TrendingUp size={18} className="text-brand-gold" />][i]}
                </div>
                <h3 className="font-syne text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 bg-light-surface dark:bg-dark-surface border-y border-light-border dark:border-dark-border">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block text-xs font-medium uppercase tracking-wider text-brand-green mb-3 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20">Cause categories</div>
          <h2 className="font-syne text-4xl font-extrabold text-gray-900 dark:text-gray-50">Fund what matters.</h2>
          <p className="text-gray-500 dark:text-gray-500 mt-3">From renewable energy to education — any cause, anywhere in the world.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }} className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer transition-all duration-200", "bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border", "hover:border-brand-green/40 hover:bg-brand-green/5 group")}>
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{c.emoji}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500 font-medium text-center">{c.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveLaunchesSection() {
  return (
    <section id="launches" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block text-xs font-medium uppercase tracking-wider text-brand-gold mb-3 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20">Live launches</div>
            <h2 className="font-syne text-4xl font-extrabold text-gray-900 dark:text-gray-50">Real causes, real trading.</h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Every token below is live on Solana. Volume counts toward hackathon rankings.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-brand-green" style={{ animation: "pulseDot 1.5s ease-in-out infinite" }} />
            <span className="text-sm font-mono text-brand-green font-medium">LIVE ON-CHAIN</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LIVE_LAUNCHES.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }} className={cn("rounded-2xl p-5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border", "hover:border-brand-gold/30 hover:shadow-lg transition-all duration-300 cursor-pointer group")}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-light-surface2 dark:bg-dark-surface2 flex items-center justify-center text-2xl">{l.emoji}</div>
                <div className={cn("text-xs font-mono font-medium px-2 py-1 rounded-lg", l.change24h >= 0 ? "bg-brand-green/10 text-brand-green" : "bg-red-500/10 text-red-400")}>
                  {l.change24h >= 0 ? "+" : ""}{l.change24h}%
                </div>
              </div>
              <div className="font-syne font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-0.5 group-hover:text-brand-gold transition-colors">
                {l.name}
              </div>
              <div className="font-mono text-xs text-brand-gold mb-2">{l.ticker} · {l.country}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed mb-3">{l.cause}</div>
              <div className="flex items-center justify-between pt-3 border-t border-light-border dark:border-dark-border">
                <div>
                  <div className="font-syne text-lg font-bold text-brand-green">${l.raised.toLocaleString()}</div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-600">raised</div>
                </div>
                <div className="text-right">
                  <div className="font-syne text-lg font-bold text-gray-700 dark:text-gray-300">{l.supporters}</div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-600">supporters</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: <Zap size={20} className="text-brand-gold" />, title: "AI token generation", desc: "Claude AI instantly creates a name, ticker, description, and viral hook for your cause." },
    { icon: <Shield size={20} className="text-brand-green" />, title: "On-chain fee splits", desc: "Bags SDK auto-splits every trade fee: 40% to your cause, 30% to holders, 20% to you." },
    { icon: <Globe size={20} className="text-brand-gold" />, title: "Global reach", desc: "Launch from anywhere. Share on WhatsApp or X. Build a global community around your cause." },
    { icon: <Users size={20} className="text-brand-green" />, title: "Proof of impact", desc: "Upload photos and receipts. On-chain evidence builds trust and drives more trading volume." },
    { icon: <Activity size={20} className="text-brand-gold" />, title: "Live dashboards", desc: "Real-time stats show how much has been raised and how many people have backed your cause." },
    { icon: <TrendingUp size={20} className="text-brand-green" />, title: "Holder rewards", desc: "30% of every trade goes back to holders — making your community token worth holding." },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light-surface dark:bg-dark-surface border-y border-light-border dark:border-dark-border">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-medium uppercase tracking-wider text-brand-gold mb-3 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20">Why ImpactBags</div>
          <h2 className="font-syne text-4xl font-extrabold text-gray-900 dark:text-gray-50">Everything built in.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }} className="rounded-2xl p-6 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border hover:border-brand-gold/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-light-surface dark:bg-dark-surface flex items-center justify-center mb-4 border border-light-border dark:border-dark-border">{f.icon}</div>
              <h3 className="font-syne text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onConnect, user }: { onConnect: () => void; user: ConnectedUser | null }) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="font-syne text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight mb-6">
            Ready to fund your <span className="text-brand-gold">cause?</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-500 mb-8">
            Join thousands of communities using ImpactBags to turn crypto trading into real-world change.
          </p>
          {user ? (
            <Link href="/launch" className="btn-gold px-10 py-5 text-lg inline-flex items-center gap-2">
              ✦ Launch your token <ArrowRight size={20} />
            </Link>
          ) : (
            <button onClick={onConnect} className="btn-gold px-10 py-5 text-lg inline-flex items-center gap-2">
              <Wallet size={20} /> Connect &amp; launch now
            </button>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">No smart contracts. No code. Takes 60 seconds.</p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-light-border dark:border-dark-border py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-syne text-lg font-extrabold"><span className="text-brand-gold">Impact</span><span className="text-brand-green">Bags</span></span>
            <span className="text-xs text-gray-400 dark:text-gray-600">Community tokens. Real change.</span>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {[["https://dev.bags.fm", "Bags Docs"], ["https://solana.com", "Solana"], ["https://console.anthropic.com", "Claude API"]].map(([href, label]) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 hover:text-brand-gold transition-colors">
                <ExternalLink size={10} />{label}
              </a>
            ))}
            <span className="text-xs text-gray-300 dark:text-gray-700 font-mono">#BagsHackathon</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<ConnectedUser | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onConnected={(u) => { setUser(u); setAuthOpen(false); }} />
      <Navbar user={user} onConnect={() => setAuthOpen(true)} onDisconnect={() => setUser(null)} />
      <main className="flex-1">
        <HeroSection onConnect={() => setAuthOpen(true)} user={user} />
        <HowItWorks />
        <CategoriesSection />
        <LiveLaunchesSection />
        <FeaturesSection />
        <CTASection onConnect={() => setAuthOpen(true)} user={user} />
      </main>
      <Footer />
    </div>
  );
}
