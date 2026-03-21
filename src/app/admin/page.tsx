"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleLogin = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed.");
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex flex-col">
      <header className="sticky top-0 z-30 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-light-border dark:border-dark-border">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="font-syne font-extrabold text-base">
            <span className="text-brand-gold">Impact</span>
            <span className="text-brand-green">Bags</span>
            <span className="text-xs text-gray-400 dark:text-gray-600 font-dm font-normal ml-2">Admin</span>
          </span>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={cn(
            "w-full max-w-sm p-8 rounded-3xl",
            "bg-light-surface dark:bg-dark-surface",
            "border border-light-border dark:border-dark-border shadow-xl"
          )}
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto mb-6">
            <Lock size={24} className="text-brand-gold" />
          </div>
          <h1 className="font-syne text-2xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-1">Admin login</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center mb-8">Enter your admin password to view the waitlist</p>

          <div className="relative mb-4">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Password"
              autoFocus
              className={cn(
                "w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none",
                "bg-light-surface2 dark:bg-dark-surface2",
                "border border-light-border dark:border-dark-border",
                "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "focus:border-brand-gold/50 transition-colors"
              )}
            />
            <button type="button" onClick={() => setShow(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
              <AlertCircle size={14} className="flex-shrink-0" /> {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !password.trim()}
            className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <><span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />Logging in…</> : "Login to dashboard"}
          </button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
            Set <code className="font-mono text-brand-gold bg-light-surface2 dark:bg-dark-surface2 px-1 rounded">ADMIN_PASSWORD</code> in <code className="font-mono text-brand-gold bg-light-surface2 dark:bg-dark-surface2 px-1 rounded">.env.local</code>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
