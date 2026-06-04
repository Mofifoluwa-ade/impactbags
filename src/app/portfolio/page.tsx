"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Loader2,
  Wallet,
  Plus,
  Users,
  Activity,
  Coins,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AuthModal } from "@/components/AuthModal";
import { useConnectedUser, creatorIdOf } from "@/lib/useConnectedUser";
import { cn, formatCurrency, shortenAddress, buildShareX } from "@/lib/utils";
import type { LiveToken } from "@/types/token";

export default function PortfolioPage() {
  const { user, walletUser, setWalletUser, ready } = useConnectedUser();
  const [authOpen, setAuthOpen] = useState(false);
  const [allTokens, setAllTokens] = useState<LiveToken[]>([]);
  const [loading, setLoading] = useState(true);

  const myId = creatorIdOf(user);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/tokens");
      const data = await res.json();
      setAllTokens(data.tokens ?? []);
    } catch {
      /* keep previous data */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 15_000);
    return () => clearInterval(iv);
  }, [load]);

  const myTokens = useMemo(
    () => (myId ? allTokens.filter((t) => t.creatorId === myId) : []),
    [allTokens, myId]
  );

  const totals = useMemo(
    () => ({
      count: myTokens.length,
      raised: myTokens.reduce((s, t) => s + (t.raised ?? 0), 0),
      supporters: myTokens.reduce((s, t) => s + (t.supporters ?? 0), 0),
      tx: myTokens.reduce((s, t) => s + (t.txCount ?? 0), 0),
    }),
    [myTokens]
  );

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onConnected={(u) => { setWalletUser(u); setAuthOpen(false); }}
      />
      <Navbar walletUser={walletUser} onWalletChange={setWalletUser} showLaunchBtn />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-50">
              My portfolio
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Monitor the community impact tokens you&apos;ve launched.
            </p>
          </div>
          <Link
            href="/launch"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-brand-gold text-gray-900 hover:bg-brand-gold-light transition-all"
          >
            <Plus size={15} /> Launch a token
          </Link>
        </div>

        {/* States */}
        {!ready || loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-400 dark:text-gray-600">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading your launches…</span>
          </div>
        ) : !user ? (
          <ConnectPrompt onConnect={() => setAuthOpen(true)} />
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              <SummaryCard icon={<Coins size={16} className="text-brand-gold" />} label="Tokens launched" value={totals.count.toLocaleString()} />
              <SummaryCard icon={<TrendingUp size={16} className="text-brand-green" />} label="Total raised" value={formatCurrency(totals.raised)} />
              <SummaryCard icon={<Users size={16} className="text-[#7EB8F7]" />} label="Supporters" value={totals.supporters.toLocaleString()} />
              <SummaryCard icon={<Activity size={16} className="text-[#B07EF7]" />} label="On-chain txns" value={totals.tx.toLocaleString()} />
            </div>

            {myTokens.length === 0 ? (
              <EmptyLaunches />
            ) : (
              <div className="flex flex-col gap-3">
                {myTokens.map((token) => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-light-border dark:border-dark-border py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-syne text-sm font-bold"><span className="text-brand-gold">Impact</span><span className="text-brand-green">AI</span></span>
          <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">#BagsHackathon · Built on Solana</span>
        </div>
      </footer>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border p-4">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-syne text-xl font-extrabold text-gray-900 dark:text-gray-50 mt-1.5">{value}</div>
    </div>
  );
}

function TokenCard({ token }: { token: LiveToken }) {
  const created = new Date(token.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const up = token.change24h >= 0;
  return (
    <div className="rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-light-surface2 dark:bg-dark-surface2 flex items-center justify-center text-xl">
          {token.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{token.name}</span>
            <span className="font-mono text-xs text-brand-gold">${token.ticker}</span>
            {token.country && <span className="text-xs">{token.country}</span>}
            <span className="text-[10px] text-gray-400 dark:text-gray-600 ml-auto whitespace-nowrap">Launched {created}</span>
          </div>
          {token.causeWallet && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">{token.causeWallet}</p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <Stat label="Raised" value={formatCurrency(token.raised)} valueClass="text-brand-green" />
            <Stat label="Supporters" value={token.supporters.toLocaleString()} />
            <Stat label="24h vol" value={formatCurrency(token.volume24h)} />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">24h</span>
              <span className={cn("flex items-center gap-0.5 text-sm font-mono", up ? "text-brand-green" : "text-red-400")}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {up ? "+" : ""}{token.change24h.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Meta + actions */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-light-border dark:border-dark-border flex-wrap">
            {token.mintAddress ? (
              <span className="font-mono text-[11px] text-gray-500 dark:text-gray-500">
                Mint: {shortenAddress(token.mintAddress)}
              </span>
            ) : (
              <span className="text-[11px] text-gray-400 dark:text-gray-600">Mint pending</span>
            )}
            <a
              href={buildShareX(token.viralHook, token.ticker)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-brand-gold transition-colors"
            >
              Share <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">{label}</span>
      <span className={cn("text-sm font-mono font-medium text-gray-800 dark:text-gray-200", valueClass)}>{value}</span>
    </div>
  );
}

function ConnectPrompt({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mb-4">
        <Wallet size={24} className="text-brand-gold" />
      </div>
      <h2 className="font-syne text-lg font-bold text-gray-900 dark:text-gray-100">Connect to view your portfolio</h2>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 max-w-sm">
        Sign in with the same wallet or account you launched with to monitor your impact tokens.
      </p>
      <button
        onClick={onConnect}
        className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-gold text-gray-900 hover:bg-brand-gold-light transition-all"
      >
        <Wallet size={15} /> Connect
      </button>
    </div>
  );
}

function EmptyLaunches() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl bg-light-surface dark:bg-dark-surface border border-dashed border-light-border dark:border-dark-border">
      <div className="text-3xl mb-3">🚀</div>
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">You haven&apos;t launched any tokens yet</h2>
      <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 max-w-xs">
        Describe a cause and let AI build your first community impact token.
      </p>
      <Link
        href="/launch"
        className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-gold text-gray-900 hover:bg-brand-gold-light transition-all"
      >
        <Plus size={15} /> Launch your first token
      </Link>
    </div>
  );
}
