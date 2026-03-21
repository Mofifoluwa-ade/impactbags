"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import type { WaitlistEntry, WaitlistStats } from "@/types/waitlist";
import {
  Users, TrendingUp, Calendar, Download, LogOut,
  Trash2, Search, RefreshCw, AlertCircle, ChevronDown,
  Mail, Globe, Sparkles, Filter,
} from "lucide-react";

// ── Role badge ────────────────────────────────────────────────────────────────

const ROLE_STYLE: Record<string, string> = {
  builder:   "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  community: "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  investor:  "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  creator:   "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  other:     "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize", ROLE_STYLE[role] ?? ROLE_STYLE.other)}>
      {role}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-2xl p-5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
      <div className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide font-medium mb-2">{label}</div>
      <div className={cn("font-syne text-3xl font-extrabold", color ?? "text-gray-900 dark:text-gray-50")}>{value}</div>
      {sub && <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

// ── Delete confirmation dialog ────────────────────────────────────────────────

function ConfirmDelete({ entry, onConfirm, onCancel }: { entry: WaitlistEntry; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm p-6 rounded-3xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border shadow-2xl"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="font-syne text-lg font-bold text-gray-900 dark:text-gray-50 text-center mb-1">Remove entry?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-500 text-center mb-6">
          <strong className="text-gray-700 dark:text-gray-300">{entry.name}</strong> ({entry.email}) will be permanently removed from the waitlist.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm border border-light-border dark:border-dark-border text-gray-600 dark:text-gray-400 hover:bg-light-surface2 dark:hover:bg-dark-surface2 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm bg-red-500 hover:bg-red-600 text-white font-medium transition-colors">
            Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  const [entries,  setEntries]  = useState<WaitlistEntry[]>([]);
  const [stats,    setStats]    = useState<WaitlistStats | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [search,   setSearch]   = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy,   setSortBy]   = useState<"newest" | "oldest" | "name">("newest");
  const [toDelete, setToDelete] = useState<WaitlistEntry | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/entries");
      if (res.status === 401) { router.push("/admin"); return; }
      if (!res.ok) throw new Error("Failed to load data");
      const data = await res.json();
      setEntries(data.entries);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const handleDelete = async (entry: WaitlistEntry) => {
    setDeleting(entry.id);
    setToDelete(null);
    try {
      const res = await fetch(`/api/admin/entries?id=${entry.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setEntries(prev => prev.filter(e => e.id !== entry.id));
      if (stats) setStats({ ...stats, total: stats.total - 1 });
    } finally {
      setDeleting(null);
    }
  };

  const handleExportCSV = () => {
    window.open("/api/admin/entries?format=csv", "_blank");
  };

  // Filter + sort
  const filtered = entries
    .filter(e => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || (e.cause ?? "").toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || e.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return a.name.localeCompare(b.name);
    });

  const roles = ["all", ...Array.from(new Set(entries.map(e => e.role)))];

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {toDelete && (
          <ConfirmDelete
            entry={toDelete}
            onConfirm={() => handleDelete(toDelete)}
            onCancel={() => setToDelete(null)}
          />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-light-border dark:border-dark-border">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-syne font-extrabold text-base">
              <span className="text-brand-gold">Impact</span>
              <span className="text-brand-green">Bags</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-medium">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={fetchData}
              title="Refresh"
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-xl text-gray-500",
                "bg-light-surface dark:bg-dark-surface",
                "border border-light-border dark:border-dark-border",
                "hover:text-brand-gold hover:border-brand-gold/40 transition-all",
                loading && "animate-spin"
              )}
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm",
                "bg-light-surface dark:bg-dark-surface",
                "border border-light-border dark:border-dark-border",
                "text-gray-500 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-all"
              )}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm mb-6">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
            <button onClick={fetchData} className="ml-auto text-xs underline">Retry</button>
          </div>
        )}

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-50">Waitlist</h1>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">Everyone who signed up for early access</p>
          </div>
          <button
            onClick={handleExportCSV}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
              "bg-light-surface dark:bg-dark-surface",
              "border border-light-border dark:border-dark-border",
              "text-gray-600 dark:text-gray-400 hover:text-brand-gold hover:border-brand-gold/40 transition-all"
            )}
          >
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total signups" value={stats.total} color="text-brand-gold" />
            <StatCard label="Today" value={stats.today} color="text-brand-green" sub="new today" />
            <StatCard label="This week" value={stats.thisWeek} sub="last 7 days" />
            <StatCard
              label="Top role"
              value={Object.entries(stats.byRole).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"}
              sub={`${Object.entries(stats.byRole).sort((a, b) => b[1] - a[1])[0]?.[1] ?? 0} people`}
            />
          </div>
        )}

        {/* Role breakdown bar */}
        {stats && Object.keys(stats.byRole).length > 0 && (
          <div className="mb-8 p-5 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
            <div className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide font-medium mb-3">Signups by role</div>
            <div className="flex w-full h-3 rounded-full overflow-hidden gap-0.5 mb-3">
              {Object.entries(stats.byRole).map(([role, count]) => {
                const colors: Record<string, string> = { builder: "#3B82F6", community: "#3DDC84", investor: "#F5A623", creator: "#A855F7", other: "#9CA3AF" };
                return (
                  <div key={role} style={{ width: `${(count / stats.total) * 100}%`, backgroundColor: colors[role] ?? "#9CA3AF" }} className="h-full rounded-full" title={`${role}: ${count}`} />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.byRole).map(([role, count]) => (
                <div key={role} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <RoleBadge role={role} />
                  <span className="font-mono font-medium">{count}</span>
                  <span className="text-gray-400 dark:text-gray-600">({Math.round((count / stats.total) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or cause…"
              className={cn(
                "w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none",
                "bg-light-surface dark:bg-dark-surface",
                "border border-light-border dark:border-dark-border",
                "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "focus:border-brand-gold/50 transition-colors"
              )}
            />
          </div>

          {/* Role filter */}
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className={cn(
                "pl-8 pr-8 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer",
                "bg-light-surface dark:bg-dark-surface",
                "border border-light-border dark:border-dark-border",
                "text-gray-700 dark:text-gray-300",
                "focus:border-brand-gold/50 transition-colors"
              )}
            >
              {roles.map(r => <option key={r} value={r}>{r === "all" ? "All roles" : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className={cn(
                "pl-4 pr-8 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer",
                "bg-light-surface dark:bg-dark-surface",
                "border border-light-border dark:border-dark-border",
                "text-gray-700 dark:text-gray-300",
                "focus:border-brand-gold/50 transition-colors"
              )}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">A → Z</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Results count */}
        <div className="text-xs text-gray-400 dark:text-gray-600 mb-3">
          Showing <span className="font-medium text-gray-700 dark:text-gray-300">{filtered.length}</span> of <span className="font-medium text-gray-700 dark:text-gray-300">{entries.length}</span> entries
        </div>

        {/* Table (desktop) / Cards (mobile) */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🕳️</div>
            <div className="font-syne font-bold text-gray-700 dark:text-gray-300 mb-1">No entries found</div>
            <div className="text-sm text-gray-400 dark:text-gray-600">{search || roleFilter !== "all" ? "Try clearing your filters" : "No one has signed up yet"}</div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-2xl overflow-hidden border border-light-border dark:border-dark-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-light-surface2 dark:bg-dark-surface2 border-b border-light-border dark:border-dark-border">
                    {["Name & Email", "Role", "Cause", "Referral", "Signed up", ""].map((h, i) => (
                      <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  <AnimatePresence>
                    {filtered.map(entry => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className={cn(
                          "bg-light-surface dark:bg-dark-surface hover:bg-light-surface2 dark:hover:bg-dark-surface2 transition-colors",
                          deleting === entry.id && "opacity-40"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{entry.name}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                            <Mail size={10} />
                            {entry.email}
                          </div>
                        </td>
                        <td className="px-4 py-3"><RoleBadge role={entry.role} /></td>
                        <td className="px-4 py-3 max-w-[200px]">
                          {entry.cause ? (
                            <div className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400">
                              <Sparkles size={10} className="flex-shrink-0 mt-0.5 text-brand-gold" />
                              <span className="line-clamp-2">{entry.cause}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300 dark:text-gray-700">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {entry.referral ? (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                              <Globe size={10} />
                              {entry.referral}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300 dark:text-gray-700">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                            <Calendar size={10} />
                            {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                          <div className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
                            {new Date(entry.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setToDelete(entry)}
                            disabled={deleting === entry.id}
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-30"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3">
              <AnimatePresence>
                {filtered.map(entry => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "rounded-2xl p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border",
                      deleting === entry.id && "opacity-40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{entry.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{entry.email}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RoleBadge role={entry.role} />
                        <button onClick={() => setToDelete(entry)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    {entry.cause && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 bg-light-surface2 dark:bg-dark-surface2 rounded-xl px-3 py-2 mb-2">
                        <span className="text-brand-gold">✦</span> {entry.cause}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-600">
                      <span>{entry.referral ?? "Direct"}</span>
                      <span>{new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
