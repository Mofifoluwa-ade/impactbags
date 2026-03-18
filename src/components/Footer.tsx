import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-light-border dark:border-dark-border mt-12 py-8">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-syne text-sm font-bold text-gray-700 dark:text-gray-400">
              <span className="text-brand-gold">Impact</span>
              <span className="text-brand-green">Bags</span>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
              Community tokens. Real-world impact.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://dev.bags.fm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 hover:text-brand-gold transition-colors"
            >
              <ExternalLink size={10} />
              Bags Docs
            </a>
            <a
              href="https://solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 hover:text-brand-gold transition-colors"
            >
              <ExternalLink size={10} />
              Solana
            </a>
            <span className="text-xs text-gray-300 dark:text-gray-700 font-mono">
              Built for #BagsHackathon
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
