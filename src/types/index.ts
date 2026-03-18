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
  walletType: "cause" | "holders" | "creator" | "platform";
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
}

export interface LaunchStats {
  raised: number;
  supporters: number;
  causeAmount: number;
  creatorAmount: number;
  volume24h: number;
  txCount: number;
}

export interface GenerateApiRequest {
  cause: string;
}

export interface GenerateApiResponse {
  token?: GeneratedToken;
  error?: string;
}

export type Theme = "light" | "dark" | "system";
