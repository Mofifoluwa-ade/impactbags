"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import type { ConnectedUser } from "@/types";

const WALLET_KEY = "impactai:wallet-user";

/**
 * Stable identity string for a connected user — used to attribute launched
 * tokens to their creator and to filter the /portfolio view. Wallet users key
 * off their address; social (NextAuth) users key off their display name.
 */
export function creatorIdOf(user: ConnectedUser | null | undefined): string | undefined {
  if (!user) return undefined;
  if (user.address) return `wallet:${user.address.toLowerCase()}`;
  if (user.displayName) return `user:${user.displayName.toLowerCase()}`;
  return undefined;
}

function readStoredWallet(): ConnectedUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WALLET_KEY);
    return raw ? (JSON.parse(raw) as ConnectedUser) : null;
  } catch {
    return null;
  }
}

/**
 * Unified connected-user identity that survives navigation and reloads.
 *
 * Merges two sources:
 *  - Wallet logins (Phantom/Solflare/Backpack/Bags) — persisted to localStorage
 *    since they have no server session.
 *  - Social logins (Google/GitHub) — read from the NextAuth session.
 *
 * Wallet identity takes priority when both are present.
 */
export function useConnectedUser() {
  const { data: session, status } = useSession();
  const [walletUser, setWalletUserState] = useState<ConnectedUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate the persisted wallet user on mount (client only).
  useEffect(() => {
    setWalletUserState(readStoredWallet());
    setHydrated(true);
  }, []);

  const setWalletUser = useCallback((u: ConnectedUser | null) => {
    setWalletUserState(u);
    if (typeof window === "undefined") return;
    try {
      if (u) window.localStorage.setItem(WALLET_KEY, JSON.stringify(u));
      else window.localStorage.removeItem(WALLET_KEY);
    } catch {
      /* ignore quota / disabled storage */
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (walletUser) {
      try {
        const win = window as unknown as {
          solana?: { isConnected?: boolean; disconnect?: () => Promise<void> };
          solflare?: { isConnected?: boolean; disconnect?: () => Promise<void> };
        };
        if (win.solana?.isConnected) await win.solana.disconnect?.();
        if (win.solflare?.isConnected) await win.solflare.disconnect?.();
      } catch {
        /* ignore */
      }
      setWalletUser(null);
    } else if (session?.user) {
      await signOut({ redirect: false });
    }
  }, [walletUser, session, setWalletUser]);

  const sessionUser: ConnectedUser | null = session?.user
    ? {
        method: "google",
        displayName: session.user.name ?? session.user.email ?? "User",
        avatar: session.user.image ?? undefined,
      }
    : null;

  const user: ConnectedUser | null = walletUser ?? sessionUser;

  return {
    user,
    walletUser,
    setWalletUser,
    disconnect,
    /** True once localStorage has been read and the NextAuth session resolved. */
    ready: hydrated && status !== "loading",
  };
}
