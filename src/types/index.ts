export type AppScreen = "home" | "generating" | "preview" | "launched";

export interface GeneratedToken {
  name: string;
  ticker: string;
  description: string;
  emoji: string;
  causeWallet: string;
  viralHook: string;
  tags: string[];
}

export interface FeeSplit {
  label: string;
  pct: number;
  color: string;
  description: string;
}

export interface LiveLaunch {
  id: string;
  emoji: string;
  name: string;
  ticker: string;
  cause: string;
  raised: number;
  supporters: number;
  change24h: number;
  country: string;
}

export interface LaunchStats {
  raised: number;
  supporters: number;
  causeAmount: number;
  creatorAmount: number;
}

export interface GenerateApiResponse {
  token?: GeneratedToken;
  error?: string;
}

export type AuthMethod = "phantom" | "solflare" | "backpack" | "google" | "github" | "bags";

export interface ConnectedUser {
  method: AuthMethod;
  address?: string;
  displayName?: string;
  avatar?: string;
}
