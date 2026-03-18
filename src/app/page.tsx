"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HomeScreen } from "@/components/HomeScreen";
import { GeneratingScreen } from "@/components/GeneratingScreen";
import { PreviewScreen } from "@/components/PreviewScreen";
import { LaunchedScreen } from "@/components/LaunchedScreen";
import type { AppScreen, GeneratedToken } from "@/types";

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [token, setToken] = useState<GeneratedToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCause, setLastCause] = useState("");

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

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Generation failed");
      }

      setToken(data.token);
      setScreen("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setScreen("home");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(() => {
    if (lastCause) handleGenerate(lastCause);
  }, [lastCause, handleGenerate]);

  const handleLaunch = useCallback(() => {
    // In production: call bagsSDK.launchToken({ ...token, feeShares: {...} })
    setScreen("launched");
  }, []);

  const goHome = useCallback(() => {
    setScreen("home");
    setToken(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
      <Navbar screen={screen} />

      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <HomeScreen
              key="home"
              onGenerate={handleGenerate}
              isLoading={isLoading}
              error={error}
            />
          )}

          {screen === "generating" && (
            <GeneratingScreen key="generating" />
          )}

          {screen === "preview" && token && (
            <PreviewScreen
              key="preview"
              token={token}
              onLaunch={handleLaunch}
              onBack={goHome}
              onRegenerate={handleRegenerate}
            />
          )}

          {screen === "launched" && token && (
            <LaunchedScreen
              key="launched"
              token={token}
              onLaunchAnother={goHome}
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
