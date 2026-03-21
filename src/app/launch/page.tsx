"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { HomeScreen } from "@/components/HomeScreen";
import { GeneratingScreen } from "@/components/GeneratingScreen";
import { PreviewScreen } from "@/components/PreviewScreen";
import { LaunchedScreen } from "@/components/LaunchedScreen";
import { AuthModal } from "@/components/AuthModal";
import type { AppScreen, GeneratedToken, ConnectedUser } from "@/types";
import { cn } from "@/lib/utils";

const STEPS: { id: AppScreen; label: string }[] = [
  { id: "home", label: "Describe" },
  { id: "generating", label: "Generate" },
  { id: "preview", label: "Review" },
  { id: "launched", label: "Launched" },
];

function StepIndicator({ screen }: { screen: AppScreen }) {
  const idx = STEPS.findIndex((s) => s.id === screen);
  if (screen === "generating") return null;
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.filter(s => s.id !== "generating").map((step, i) => {
        const stepIdx = STEPS.findIndex(s2 => s2.id === step.id);
        const done = idx > stepIdx;
        const active = idx === stepIdx;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                done ? "bg-brand-green text-gray-900" : active ? "bg-brand-gold text-gray-900" : "bg-light-surface2 dark:bg-dark-surface2 text-gray-400 dark:text-gray-600 border border-light-border dark:border-dark-border"
              )}>
                {done ? "✓" : i + 1}
              </div>
              <span className={cn("text-[10px] font-medium", active ? "text-brand-gold" : done ? "text-brand-green" : "text-gray-400 dark:text-gray-600")}>
                {step.label}
              </span>
            </div>
            {i < STEPS.filter(s => s.id !== "generating").length - 1 && (
              <div className={cn("w-12 sm:w-20 h-px mx-2 mb-4 transition-all duration-300", done ? "bg-brand-green" : "bg-light-border dark:bg-dark-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LaunchPage() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [token, setToken] = useState<GeneratedToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCause, setLastCause] = useState("");
  const [user, setUser] = useState<ConnectedUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const handleGenerate = useCallback(async (cause: string) => {
    setError(null);
    setIsLoading(true);
    setLastCause(cause);
    setScreen("generating");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cause }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Generation failed");
      setToken(data.token);
      setScreen("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setScreen("home");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLaunch = useCallback(() => {
    if (!user) { setAuthOpen(true); return; }
    // Production: await bagsSDK.launchToken({ ...token, feeShares: { cause: "0.40", holders: "0.30", creator: "0.20", platform: "0.10" } })
    setScreen("launched");
  }, [user]);

  const goHome = useCallback(() => {
    setScreen("home"); setToken(null); setError(null); setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onConnected={(u) => { setUser(u); setAuthOpen(false); if (screen === "preview" && token) setScreen("launched"); }} />
     <Navbar walletUser={user} onWalletChange={setUser} showLaunchBtn={false} />

      <main className="flex-1 w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-50">
            {screen === "home" && "Launch a cause token"}
            {screen === "generating" && "Generating your token…"}
            {screen === "preview" && "Review your token"}
            {screen === "launched" && "Your token is live! 🎉"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {screen === "home" && "Describe your cause, AI builds the token, Bags deploys it on Solana."}
            {screen === "generating" && "Claude AI is crafting your token identity."}
            {screen === "preview" && "Review everything before it goes live on-chain."}
            {screen === "launched" && "Share it and watch the community fund your cause."}
          </p>
        </div>

        <StepIndicator screen={screen} />

        <AnimatePresence mode="wait">
          {screen === "home" && (
            <HomeScreen key="home" onGenerate={handleGenerate} isLoading={isLoading} error={error} />
          )}
          {screen === "generating" && (
            <GeneratingScreen key="generating" />
          )}
          {screen === "preview" && token && (
            <PreviewScreen key="preview" token={token} onLaunch={handleLaunch} onBack={goHome} onRegenerate={() => handleGenerate(lastCause)} />
          )}
          {screen === "launched" && token && (
            <LaunchedScreen key="launched" token={token} onLaunchAnother={goHome} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-light-border dark:border-dark-border py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-syne text-sm font-bold"><span className="text-brand-gold">Impact</span><span className="text-brand-green">Bags</span></span>
          <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">#BagsHackathon · Built on Solana</span>
        </div>
      </footer>
    </div>
  );
}
