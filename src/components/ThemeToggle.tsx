"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl bg-light-surface2 dark:bg-dark-surface2 animate-pulse" />
    );
  }

  if (compact) {
    const current = THEMES.find((t) => t.value === theme) ?? THEMES[1];
    const Icon = current.icon;
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];

    return (
      <button
        onClick={() => setTheme(next.value)}
        aria-label={`Switch to ${next.label} mode`}
        className={cn(
          "flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-200",
          "bg-light-surface2 dark:bg-dark-surface2",
          "border border-light-border dark:border-dark-border",
          "text-gray-600 dark:text-gray-400 hover:text-brand-gold",
          "hover:border-brand-gold/40"
        )}
      >
        <Icon size={16} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-light-surface2 dark:bg-dark-surface2 border border-light-border dark:border-dark-border">
      {THEMES.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={`${label} mode`}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
            theme === value
              ? "bg-brand-gold text-gray-900"
              : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <Icon size={13} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
