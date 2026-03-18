import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return "$" + (amount / 1000).toFixed(1) + "k";
  }
  return "$" + amount.toLocaleString();
}

export function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function buildShareX(viralHook: string, ticker: string): string {
  const text = encodeURIComponent(
    `${viralHook} 🚀\n\nTrade $${ticker} on @bagsdotfm and fund real communities. bags.fm/token/${ticker}`
  );
  return `https://twitter.com/intent/tweet?text=${text}`;
}

export function buildShareWhatsApp(viralHook: string, ticker: string): string {
  const text = encodeURIComponent(
    `${viralHook}\n\n💰 Trade $${ticker} — every swap funds the cause!\n\nbags.fm/token/${ticker}`
  );
  return `https://wa.me/?text=${text}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
