export interface LiveToken {
  id: string;
  name: string;
  ticker: string;
  emoji: string;
  description: string;
  causeWallet: string;
  viralHook: string;
  tags: string[];
  // on-chain data (populated after Bags SDK launch)
  mintAddress?: string;
  // stats — updated each time someone trades / we poll
  raised: number;          // USD value raised so far
  supporters: number;      // unique holder/buyer count
  volume24h: number;       // 24h trading volume USD
  change24h: number;       // % price change 24h
  txCount: number;         // total on-chain transactions
  // metadata
  creatorWallet?: string;
  creatorDisplay?: string; // name or short address
  createdAt: string;       // ISO string
  proofPhotos: string[];   // IPFS URLs of impact proof
  country?: string;        // flag emoji e.g. "🇳🇬"
  category?: string;       // "energy" | "water" | "education" etc.
}

export interface PlatformStats {
  totalTokens: number;
  totalRaised: number;
  totalSupporters: number;
  totalTx: number;
  countries: number;
}
