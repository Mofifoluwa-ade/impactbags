"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { cn, shortenAddress } from "@/lib/utils";
import type { AuthMethod, ConnectedUser } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (user: ConnectedUser) => void;
}

interface WalletOption {
  id: AuthMethod;
  label: string;
  description: string;
  icon: string;
  type: "wallet" | "social";
  installUrl?: string;
  color: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  { id: "phantom", label: "Phantom", description: "Most popular Solana wallet", icon: "👻", type: "wallet", installUrl: "https://phantom.app", color: "#AB9FF2" },
  { id: "solflare", label: "Solflare", description: "Non-custodial Solana wallet", icon: "🔥", type: "wallet", installUrl: "https://solflare.com", color: "#FC7B24" },
  { id: "backpack", label: "Backpack", description: "Multi-chain wallet by xNFT", icon: "🎒", type: "wallet", installUrl: "https://backpack.app", color: "#E33E3F" },
  { id: "bags", label: "Bags", description: "Native Bags platform account", icon: "👜", type: "social", color: "#F5A623" },
  { id: "google", label: "Google", description: "Sign in with your Google account", icon: "G", type: "social", color: "#4285F4" },
  { id: "github", label: "GitHub", description: "Sign in with your GitHub account", icon: "⬡", type: "social", color: "#6e5494" },
];

function detectWallet(id: AuthMethod): boolean {
  if (typeof window === "undefined") return false;
  if (id === "phantom") return !!(window as any).solana?.isPhantom;
  if (id === "solflare") return !!(window as any).solflare?.isSolflare;
  if (id === "backpack") return !!(window as any).xnft?.solana;
  return true; // social always available
}

async function connectPhantom(): Promise<string> {
  const provider = (window as any).solana;
  if (!provider?.isPhantom) throw new Error("Phantom not installed");
  const resp = await provider.connect();
  return resp.publicKey.toString();
}

async function connectSolflare(): Promise<string> {
  const provider = (window as any).solflare;
  if (!provider?.isSolflare) throw new Error("Solflare not installed");
  await provider.connect();
  return provider.publicKey.toString();
}

async function connectBackpack(): Promise<string> {
  const provider = (window as any).xnft?.solana;
  if (!provider) throw new Error("Backpack not installed");
  await provider.connect();
  return provider.publicKey.toString();
}

export function AuthModal({ isOpen, onClose, onConnected }: AuthModalProps) {
  const [loading, setLoading] = useState<AuthMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletAvailable, setWalletAvailable] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const avail: Record<string, boolean> = {};
      WALLET_OPTIONS.filter(w => w.type === "wallet").forEach(w => {
        avail[w.id] = detectWallet(w.id);
      });
      setWalletAvailable(avail);
      setError(null);
    }
  }, [isOpen]);

  const handleConnect = useCallback(async (opt: WalletOption) => {
    setLoading(opt.id);
    setError(null);

    try {
      if (opt.id === "phantom") {
        const address = await connectPhantom();
        onConnected({ method: "phantom", address, displayName: shortenAddress(address) });
        onClose();
        return;
      }

      if (opt.id === "solflare") {
        const address = await connectSolflare();
        onConnected({ method: "solflare", address, displayName: shortenAddress(address) });
        onClose();
        return;
      }

      if (opt.id === "backpack") {
        const address = await connectBackpack();
        onConnected({ method: "backpack", address, displayName: shortenAddress(address) });
        onClose();
        return;
      }

      // Social logins — simulate OAuth redirect flow
      if (opt.id === "google") {
        // In production: window.location.href = "/api/auth/google"
        await new Promise(r => setTimeout(r, 1200));
        onConnected({ method: "google", displayName: "Google User", avatar: "G" });
        onClose();
        return;
      }

      if (opt.id === "github") {
        // In production: window.location.href = "/api/auth/github"
        await new Promise(r => setTimeout(r, 1200));
        onConnected({ method: "github", displayName: "GitHub User", avatar: "⬡" });
        onClose();
        return;
      }

      if (opt.id === "bags") {
        await new Promise(r => setTimeout(r, 1000));
        onConnected({ method: "bags", displayName: "Bags User", avatar: "👜" });
        onClose();
        return;
      }
    } catch (err: any) {
      const msg = err?.message ?? "Connection failed";
      if (msg.includes("not installed") && opt.installUrl) {
        setError(`${opt.label} wallet not detected. <a href="${opt.installUrl}" target="_blank" rel="noopener">Install it here ↗</a>`);
      } else if (msg.includes("User rejected") || msg.includes("cancelled")) {
        setError("Connection cancelled.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(null);
    }
  }, [onConnected, onClose]);

  const wallets = WALLET_OPTIONS.filter(o => o.type === "wallet");
  const socials = WALLET_OPTIONS.filter(o => o.type === "social");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md",
              "bg-light-surface dark:bg-dark-surface",
              "border border-light-border dark:border-dark-border",
              "rounded-3xl shadow-2xl p-6"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-syne text-xl font-extrabold text-gray-900 dark:text-gray-50">
                  Connect to ImpactBags
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Choose a wallet or sign in with a social account
                </p>
              </div>
              <button
                onClick={onClose}
                className={cn(
                  "ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl",
                  "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                  "bg-light-surface2 dark:bg-dark-surface2 transition-colors"
                )}
              >
                <X size={16} />
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm overflow-hidden"
                >
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span dangerouslySetInnerHTML={{ __html: error }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wallet options */}
            <div className="mb-4">
              <p className="text-[11px] text-gray-400 dark:text-gray-600 uppercase tracking-wider font-medium mb-2.5">
                Solana Wallets
              </p>
              <div className="flex flex-col gap-2">
                {wallets.map((opt) => {
                  const installed = walletAvailable[opt.id];
                  const isLoading = loading === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleConnect(opt)}
                      disabled={!!loading}
                      className={cn(
                        "flex items-center gap-3 w-full p-3.5 rounded-2xl text-left transition-all duration-150",
                        "bg-light-surface2 dark:bg-dark-surface2",
                        "border border-light-border dark:border-dark-border",
                        "hover:border-brand-gold/50 hover:bg-brand-gold/5",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        isLoading && "border-brand-gold/50 bg-brand-gold/5"
                      )}
                    >
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: opt.color + "22" }}
                      >
                        {isLoading ? (
                          <Loader2 size={18} className="animate-spin" style={{ color: opt.color }} />
                        ) : (
                          <span style={{ filter: "drop-shadow(0 0 4px " + opt.color + "66)" }}>
                            {opt.icon}
                          </span>
                        )}
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {opt.label}
                          </span>
                          {installed && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-green/20 text-brand-green font-medium">
                              Detected
                            </span>
                          )}
                          {!installed && (
                            <a
                              href={opt.installUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] flex items-center gap-0.5 text-gray-400 hover:text-brand-gold"
                            >
                              Install <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {opt.description}
                        </div>
                      </div>

                      {installed && !isLoading && (
                        <div className="w-2 h-2 rounded-full bg-brand-green flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-light-border dark:bg-dark-border" />
              <span className="text-xs text-gray-400 dark:text-gray-600">or continue with</span>
              <div className="flex-1 h-px bg-light-border dark:bg-dark-border" />
            </div>

            {/* Social logins */}
            <div className="grid grid-cols-3 gap-2">
              {socials.map((opt) => {
                const isLoading = loading === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleConnect(opt)}
                    disabled={!!loading}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-150",
                      "bg-light-surface2 dark:bg-dark-surface2",
                      "border border-light-border dark:border-dark-border",
                      "hover:border-brand-gold/50 hover:bg-brand-gold/5",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
                      style={{ backgroundColor: opt.color + "22", color: opt.color }}
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : opt.icon}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-[11px] text-gray-400 dark:text-gray-600 mt-5">
              By connecting you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
