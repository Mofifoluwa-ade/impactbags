import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) { return clsx(inputs); }

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return "$" + (amount / 1_000_000).toFixed(1) + "M";
  if (amount >= 1000) return "$" + (amount / 1000).toFixed(1) + "k";
  return "$" + amount.toLocaleString();
}

export function buildShareX(viralHook: string, ticker: string): string {
  const text = encodeURIComponent(`${viralHook} 🚀\nTrade $${ticker} on @bagsdotfm — every swap funds the cause.\nbags.fm/token/${ticker}`);
  return `https://twitter.com/intent/tweet?text=${text}`;
}

export function buildShareWhatsApp(viralHook: string, ticker: string): string {
  const text = encodeURIComponent(`${viralHook}\n\n💰 Trade $${ticker} — every swap funds the cause!\nbags.fm/token/${ticker}`);
  return `https://wa.me/?text=${text}`;
}

export function shortenAddress(addr: string): string {
  return addr.slice(0, 4) + "…" + addr.slice(-4);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
