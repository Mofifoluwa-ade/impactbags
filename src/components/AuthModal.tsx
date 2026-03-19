"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { cn, shortenAddress } from "@/lib/utils";
import type { AuthMethod, ConnectedUser } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (user: ConnectedUser) => void;
}

// ── Brand logos as inline SVG ─────────────────────────────────────────────────

function PhantomLogo() {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#AB9FF2"/>
      <path d="M110.584 64.924c0 24.682-20.019 44.701-44.701 44.701-9.515 0-18.33-2.98-25.565-8.067-.89-.63-1.09-1.87-.46-2.76.63-.89 1.87-1.09 2.76-.46 6.57 4.63 14.6 7.35 23.265 7.35 22.26 0 40.294-18.034 40.294-40.294 0-22.26-18.034-40.294-40.294-40.294C43.624 25.1 25.59 43.134 25.59 65.394c0 3.9.56 7.67 1.6 11.23.27.94-.27 1.92-1.21 2.19-.94.27-1.92-.27-2.19-1.21a44.444 44.444 0 01-1.606-12.21c0-24.682 20.019-44.701 44.701-44.701s44.7 20.019 44.7 44.232z" fill="white"/>
      <circle cx="76" cy="66" r="9" fill="white"/>
      <circle cx="52" cy="66" r="9" fill="white"/>
      <circle cx="79" cy="62" r="3" fill="#AB9FF2"/>
      <circle cx="55" cy="62" r="3" fill="#AB9FF2"/>
    </svg>
  );
}

function SolflareLogo() {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#FC7B24"/>
      <path d="M64 18L34 70h20v22l40-44H74V18H64z" fill="white"/>
    </svg>
  );
}

function BackpackLogo() {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#E33E3F"/>
      <path d="M64 20c-9.941 0-18 8.059-18 18v4H32a8 8 0 00-8 8v46a8 8 0 008 8h64a8 8 0 008-8V50a8 8 0 00-8-8H82v-4c0-9.941-8.059-18-18-18zm0 10c4.418 0 8 3.582 8 8v4H56v-4c0-4.418 3.582-8 8-8zm0 38a10 10 0 110 20 10 10 0 010-20z" fill="white"/>
    </svg>
  );
}

function BagsLogo() {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#1A1A1A"/>
      <path d="M48 36h32l10 18H38L48 36z" fill="#F5A623"/>
      <rect x="26" y="58" width="76" height="44" rx="10" fill="#F5A623"/>
      <path d="M46 76h36M46 88h22" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="white"/>
      <path d="M112 65.6c0-3.6-.3-7.1-.9-10.4H64v19.7h26.9c-1.2 6.2-4.7 11.4-10 14.9v12.4h16.2C107.6 93.1 112 80.3 112 65.6z" fill="#4285F4"/>
      <path d="M64 114c13.5 0 24.8-4.5 33.1-12.1L80.9 89.5C76.4 92.5 70.6 94.3 64 94.3c-13.1 0-24.2-8.8-28.1-20.7H19.2v12.8C27.5 104.1 44.7 114 64 114z" fill="#34A853"/>
      <path d="M35.9 73.6c-1-.3-2-5-2-9.6s1-9.3 2-9.6V41.6H19.2A48.4 48.4 0 0015.2 64c0 7.8 1.9 15.2 5 21.8l16.7-12.2z" fill="#FBBC05"/>
      <path d="M64 33.7c7.4 0 14.1 2.5 19.3 7.5l14.5-14.5C89 18.6 77.5 14 64 14c-19.3 0-36.5 10.9-45 27l16.7 12.2C39.8 42.5 51 33.7 64 33.7z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect width="128" height="128" rx="28" fill="#24292E"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M64 16C37.49 16 16 37.49 16 64c0 21.23 13.76 39.24 32.85 45.6 2.4.44 3.28-1.04 3.28-2.32 0-1.14-.04-4.16-.07-8.16-13.36 2.9-16.17-6.44-16.17-6.44-2.18-5.54-5.33-7.02-5.33-7.02-4.36-2.98.33-2.92.33-2.92 4.82.34 7.35 4.94 7.35 4.94 4.28 7.34 11.24 5.22 13.98 3.99.44-3.1 1.67-5.22 3.04-6.42-10.66-1.21-21.88-5.33-21.88-23.73 0-5.24 1.87-9.52 4.94-12.88-.5-1.21-2.14-6.1.46-12.72 0 0 4.03-1.29 13.2 4.92a46.01 46.01 0 0112.02-1.62c4.08.02 8.18.55 12.02 1.62 9.16-6.21 13.19-4.92 13.19-4.92 2.6 6.62.97 11.51.47 12.72 3.08 3.36 4.94 7.64 4.94 12.88 0 18.44-11.24 22.51-21.93 23.7 1.72 1.49 3.25 4.42 3.25 8.9 0 6.43-.06 11.61-.06 13.19 0 1.28.87 2.78 3.31 2.31C98.25 103.22 112 85.22 112 64c0-26.51-21.49-48-48-48z" fill="white"/>
    </svg>
  );
}

// ── Option config ─────────────────────────────────────────────────────────────

interface WalletOption {
  id: AuthMethod;
  label: string;
  description: string;
  Logo: React.FC;
  type: "wallet" | "social";
  installUrl?: string;
  accentColor: string;
}

const OPTIONS: WalletOption[] = [
  { id: "phantom",  label: "Phantom",  description: "Most popular Solana wallet",     Logo: PhantomLogo,  type: "wallet", installUrl: "https://phantom.app",  accentColor: "#AB9FF2" },
  { id: "solflare", label: "Solflare", description: "Non-custodial Solana wallet",    Logo: SolflareLogo, type: "wallet", installUrl: "https://solflare.com", accentColor: "#FC7B24" },
  { id: "backpack", label: "Backpack", description: "Multi-chain wallet by xNFT",     Logo: BackpackLogo, type: "wallet", installUrl: "https://backpack.app", accentColor: "#E33E3F" },
  { id: "bags",     label: "Bags",     description: "Sign in with your Bags account", Logo: BagsLogo,     type: "social",                                     accentColor: "#F5A623" },
  { id: "google",   label: "Google",   description: "Sign in with Google",            Logo: GoogleLogo,   type: "social",                                     accentColor: "#4285F4" },
  { id: "github",   label: "GitHub",   description: "Sign in with GitHub",            Logo: GitHubLogo,   type: "social",                                     accentColor: "#6e5494" },
];

// ── Wallet connection helpers ─────────────────────────────────────────────────

function detectWallet(id: AuthMethod): boolean {
  if (typeof window === "undefined") return false;
  if (id === "phantom")  return !!(window as any).solana?.isPhantom;
  if (id === "solflare") return !!(window as any).solflare?.isSolflare;
  if (id === "backpack") return !!(window as any).xnft?.solana;
  return true;
}

async function connectSolanaWallet(id: "phantom" | "solflare" | "backpack"): Promise<string> {
  if (id === "phantom") {
    const p = (window as any).solana;
    if (!p?.isPhantom) throw new Error("Phantom not installed");
    const r = await p.connect();
    return r.publicKey.toString();
  }
  if (id === "solflare") {
    const p = (window as any).solflare;
    if (!p?.isSolflare) throw new Error("Solflare not installed");
    await p.connect();
    return p.publicKey.toString();
  }
  const p = (window as any).xnft?.solana;
  if (!p) throw new Error("Backpack not installed");
  await p.connect();
  return p.publicKey.toString();
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export function AuthModal({ isOpen, onClose, onConnected }: AuthModalProps) {
  const [loading, setLoading] = useState<AuthMethod | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [detected, setDetected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    const d: Record<string, boolean> = {};
    OPTIONS.filter(o => o.type === "wallet").forEach(o => { d[o.id] = detectWallet(o.id); });
    setDetected(d);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  const handleConnect = useCallback(async (opt: WalletOption) => {
    setLoading(opt.id);
    setError(null);
    try {
      if (opt.id === "phantom" || opt.id === "solflare" || opt.id === "backpack") {
        const address = await connectSolanaWallet(opt.id);
        onConnected({ method: opt.id, address, displayName: shortenAddress(address) });
        onClose();
        return;
      }
      // Social: simulate OAuth (replace with NextAuth in production)
      await new Promise(r => setTimeout(r, 1100));
      onConnected({ method: opt.id, displayName: opt.label + " User", avatar: opt.label[0] });
      onClose();
    } catch (err: any) {
      const msg: string = err?.message ?? "Connection failed";
      if (msg.includes("not installed") && opt.installUrl) {
        setError(`${opt.label} not detected. <a href="${opt.installUrl}" target="_blank" rel="noopener" class="underline font-medium">Install it ↗</a>`);
      } else if (/reject|cancel/i.test(msg)) {
        setError("Connection cancelled.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(null);
    }
  }, [onConnected, onClose]);

  const wallets = OPTIONS.filter(o => o.type === "wallet");
  const socials = OPTIONS.filter(o => o.type === "social");

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Backdrop: fixed fullscreen, flex-centred ── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* ── Modal panel ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.94, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-md",
              "bg-light-surface dark:bg-dark-surface",
              "border border-light-border dark:border-dark-border",
              "rounded-3xl shadow-2xl p-6"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-syne text-xl font-extrabold text-gray-900 dark:text-gray-50">
                  Connect to ImpactBags
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                  Choose a wallet or sign in with a social account
                </p>
              </div>
              <button
                onClick={onClose}
                className={cn(
                  "ml-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl",
                  "bg-light-surface2 dark:bg-dark-surface2",
                  "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                )}
              >
                <X size={15} />
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{   opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: error }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Wallet rows ── */}
            <p className="text-[11px] text-gray-400 dark:text-gray-600 uppercase tracking-wider font-medium mb-2.5">
              Solana Wallets
            </p>
            <div className="flex flex-col gap-2 mb-5">
              {wallets.map((opt) => {
                const isInstalled = detected[opt.id];
                const isLoading   = loading === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleConnect(opt)}
                    disabled={!!loading}
                    className={cn(
                      "flex items-center gap-3 w-full p-3.5 rounded-2xl text-left transition-all duration-150",
                      "bg-light-surface2 dark:bg-dark-surface2",
                      "border border-light-border dark:border-dark-border",
                      "hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed",
                      isLoading   && "opacity-80"
                    )}
                    style={isLoading || isInstalled
                      ? { borderColor: opt.accentColor + "60" }
                      : undefined}
                    onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.borderColor = opt.accentColor + "50"; }}
                    onMouseLeave={e => { if (!isLoading && !isInstalled) (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                  >
                    {/* Logo */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-white/5 border border-light-border dark:border-dark-border">
                      {isLoading
                        ? <Loader2 size={18} className="animate-spin" style={{ color: opt.accentColor }} />
                        : <opt.Logo />
                      }
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {opt.label}
                        </span>
                        {isInstalled && !isLoading && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-green/20 text-brand-green font-medium">
                            Detected
                          </span>
                        )}
                        {!isInstalled && opt.installUrl && (
                          <a
                            href={opt.installUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-brand-gold transition-colors"
                          >
                            Install <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                        {opt.description}
                      </div>
                    </div>

                    {/* Live dot */}
                    {isInstalled && !isLoading && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opt.accentColor }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-light-border dark:bg-dark-border" />
              <span className="text-xs text-gray-400 dark:text-gray-600 flex-shrink-0">or continue with</span>
              <div className="flex-1 h-px bg-light-border dark:bg-dark-border" />
            </div>

            {/* ── Social grid ── */}
            <div className="grid grid-cols-3 gap-2">
              {socials.map((opt) => {
                const isLoading = loading === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleConnect(opt)}
                    disabled={!!loading}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3.5 rounded-2xl transition-all duration-150",
                      "bg-light-surface2 dark:bg-dark-surface2",
                      "border border-light-border dark:border-dark-border",
                      "hover:border-brand-gold/50 hover:bg-brand-gold/5",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-white/5 border border-light-border dark:border-dark-border">
                      {isLoading
                        ? <Loader2 size={16} className="animate-spin" style={{ color: opt.accentColor }} />
                        : <opt.Logo />
                      }
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-[11px] text-gray-400 dark:text-gray-600 mt-5">
              By connecting you agree to our Terms of Service &amp; Privacy Policy
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
