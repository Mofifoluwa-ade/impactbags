"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  BookOpen, Zap, Code2, Wallet, Globe, Shield,
  ChevronRight, ExternalLink, Copy, Check,
  Terminal, Layers, GitBranch, Lock, ArrowRight,
  Menu, X, Hash,
} from "lucide-react";

// ── Code block ────────────────────────────────────────────────────────────────

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group rounded-2xl overflow-hidden border border-light-border dark:border-dark-border my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-light-surface2 dark:bg-dark-surface2 border-b border-light-border dark:border-dark-border">
        <span className="text-xs font-mono text-gray-400 dark:text-gray-600">{language}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-gold transition-colors">
          {copied ? <><Check size={12} className="text-brand-green" /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-light-surface dark:bg-dark-surface">
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// ── Inline code ───────────────────────────────────────────────────────────────

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[13px] px-1.5 py-0.5 rounded-md bg-light-surface2 dark:bg-dark-surface2 text-brand-gold border border-light-border dark:border-dark-border">
      {children}
    </code>
  );
}

// ── Callout ───────────────────────────────────────────────────────────────────

function Callout({ type = "info", children }: { type?: "info" | "warning" | "tip" | "danger"; children: React.ReactNode }) {
  const styles = {
    info:    { bg: "bg-blue-50 dark:bg-blue-950/20",   border: "border-blue-200 dark:border-blue-900/40",   icon: "ℹ",  text: "text-blue-700 dark:text-blue-400",  label: "Note" },
    warning: { bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-200 dark:border-amber-900/40", icon: "⚠",  text: "text-amber-700 dark:text-amber-400", label: "Warning" },
    tip:     { bg: "bg-green-50 dark:bg-green-950/20", border: "border-green-200 dark:border-green-900/40", icon: "✦", text: "text-green-700 dark:text-green-400",  label: "Tip" },
    danger:  { bg: "bg-red-50 dark:bg-red-950/20",     border: "border-red-200 dark:border-red-900/40",     icon: "✕",  text: "text-red-700 dark:text-red-400",     label: "Important" },
  }[type];
  return (
    <div className={cn("flex gap-3 p-4 rounded-2xl border my-4", styles.bg, styles.border)}>
      <span className={cn("text-base flex-shrink-0 mt-0.5", styles.text)}>{styles.icon}</span>
      <div>
        <span className={cn("text-xs font-semibold uppercase tracking-wide block mb-1", styles.text)}>{styles.label}</span>
        <div className={cn("text-sm leading-relaxed", styles.text)}>{children}</div>
      </div>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="group flex items-center gap-2 font-syne text-2xl font-extrabold text-gray-900 dark:text-gray-50 mt-12 mb-4 scroll-mt-20">
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Hash size={16} className="text-gray-400" />
      </a>
    </h2>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="group flex items-center gap-2 font-syne text-lg font-bold text-gray-900 dark:text-gray-50 mt-8 mb-3 scroll-mt-20">
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Hash size={13} className="text-gray-400" />
      </a>
    </h3>
  );
}

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: "Getting Started",
    icon: Zap,
    items: [
      { id: "overview",      label: "Overview" },
      { id: "quickstart",    label: "Quick start" },
      { id: "env-vars",      label: "Environment variables" },
      { id: "project-structure", label: "Project structure" },
    ],
  },
  {
    label: "Core Concepts",
    icon: Layers,
    items: [
      { id: "how-it-works",  label: "How it works" },
      { id: "fee-splits",    label: "Fee splits" },
      { id: "token-launch",  label: "Token launch flow" },
    ],
  },
  {
    label: "Auth & Wallets",
    icon: Lock,
    items: [
      { id: "wallet-connect", label: "Wallet connection" },
      { id: "oauth",          label: "OAuth (Google & GitHub)" },
      { id: "session",        label: "Session management" },
    ],
  },
  {
    label: "API Reference",
    icon: Code2,
    items: [
      { id: "api-generate",  label: "POST /api/generate" },
      { id: "api-auth",      label: "NextAuth routes" },
    ],
  },
  {
    label: "Deployment",
    icon: Globe,
    items: [
      { id: "deploy-vercel", label: "Deploy to Vercel" },
      { id: "production",    label: "Production checklist" },
      { id: "bags-sdk",      label: "Wiring up Bags SDK" },
    ],
  },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ active, onClose }: { active: string; onClose?: () => void }) {
  return (
    <nav className="flex flex-col gap-6 py-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <div className="flex items-center gap-2 px-3 mb-2">
            <section.icon size={13} className="text-brand-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
              {section.label}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all duration-150",
                  active === item.id
                    ? "bg-brand-gold/10 text-brand-gold font-medium border-l-2 border-brand-gold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-light-surface2 dark:hover:bg-dark-surface2"
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll spy
  useEffect(() => {
    const allIds = NAV_SECTIONS.flatMap(s => s.items.map(i => i.id));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    allIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">

      {/* ── Top navbar ── */}
      <header className="sticky top-0 z-30 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-light-border dark:border-dark-border">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileNavOpen(p => !p)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-xl bg-light-surface2 dark:bg-dark-surface2 text-gray-500"
            >
              {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-gold/20 flex items-center justify-center">
                <span className="text-brand-gold text-sm">⚡</span>
              </div>
              <span className="font-syne font-extrabold text-base">
                <span className="text-brand-gold">Impact</span>
                <span className="text-brand-green">AI</span>
              </span>
            </Link>
            <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-medium">
              <BookOpen size={10} /> Docs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <GitBranch size={13} /> GitHub
            </a>
            <ThemeToggle />
            <Link
              href="/launch"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-brand-gold text-gray-900 hover:bg-brand-gold-light transition-all"
            >
              Launch app <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile sidebar overlay ── */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-20 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-14 bottom-0 w-72 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border overflow-y-auto px-3">
            <Sidebar active={activeSection} onClose={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto flex">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-light-border dark:border-dark-border px-3">
          <Sidebar active={activeSection} />
        </aside>

        {/* ── Main content ── */}
        <main ref={contentRef} className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 xl:px-16 py-10 max-w-3xl">

          {/* Hero */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-brand-green/10 text-brand-green border border-brand-green/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              v0.1.0 · Bags Hackathon Edition
            </div>
            <h1 className="font-syne text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight mb-4">
              ImpactAI Documentation
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              Everything you need to understand, run, extend, and deploy ImpactAI — the platform that turns any community cause into a Solana token in 60 seconds.
            </p>
          </div>

          {/* ════════════════════════════════════════════
              GETTING STARTED
          ════════════════════════════════════════════ */}

          <H2 id="overview">Overview</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            ImpactAI is a Next.js 14 web application that lets anyone launch a Solana token for a real-world community cause — clean energy, clean water, education, healthcare — with no code, no bank account, and no smart contract knowledge.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            The platform is built on three foundations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { icon: "🤖", title: "Gemini AI", desc: "Generates token name, ticker, description and viral hook from a one-sentence cause description." },
              { icon: "⚡", title: "Bags SDK", desc: "Deploys the token on Solana and configures automatic fee splits on every trade." },
              { icon: "🔐", title: "NextAuth + Wallets", desc: "Authenticates users via Phantom, Solflare, Backpack, Google, or GitHub." },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="font-syne font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{f.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          <H2 id="quickstart">Quick start</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">Clone the repo and install dependencies:</p>
          <CodeBlock language="bash" code={`git clone https://github.com/your-username/impactai.git
cd impactai
npm install`} />
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">Copy the example environment file:</p>
          <CodeBlock language="bash" code={`cp .env.local.example .env.local`} />
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">Add your Gemini API key (minimum required to run locally):</p>
          <CodeBlock language="bash" code={`# .env.local
GEMINI_API_KEY=your-gemini-key
NEXTAUTH_SECRET=any-random-string-for-local-dev
NEXTAUTH_URL=http://localhost:3000`} />
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">Start the development server:</p>
          <CodeBlock language="bash" code={`npm run dev
# Open http://localhost:3000`} />
          <Callout type="tip">
            You can use the app without Google/GitHub credentials — wallet connect works immediately. Social login requires OAuth credentials (see <a href="#oauth" className="underline">OAuth setup</a>).
          </Callout>

          <H2 id="env-vars">Environment variables</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            All variables live in <Code>.env.local</Code> which is never committed to Git.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-light-border dark:border-dark-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-light-surface2 dark:bg-dark-surface2 border-b border-light-border dark:border-dark-border">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Variable</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Required</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {[
                  ["GEMINI_API_KEY",    "✅ Yes",   "Gemini API key — get at aistudio.google.com/app/apikey"],
                  ["NEXTAUTH_SECRET",       "✅ Yes",   "Random secret for signing JWT sessions"],
                  ["NEXTAUTH_URL",          "✅ Yes",   "Full URL of your app (http://localhost:3000 locally)"],
                  ["GOOGLE_CLIENT_ID",      "Optional", "Google OAuth app client ID"],
                  ["GOOGLE_CLIENT_SECRET",  "Optional", "Google OAuth app client secret"],
                  ["GITHUB_CLIENT_ID",      "Optional", "GitHub OAuth app client ID"],
                  ["GITHUB_CLIENT_SECRET",  "Optional", "GitHub OAuth app client secret"],
                  ["BAGS_API_KEY",          "Optional", "Bags SDK key for production token launch"],
                ].map(([key, req, desc]) => (
                  <tr key={key} className="bg-light-surface dark:bg-dark-surface">
                    <td className="px-4 py-3 font-mono text-xs text-brand-gold">{key}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">{req}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2 id="project-structure">Project structure</H2>
          <CodeBlock language="text" code={`impactai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   │   └── generate/route.ts             # Gemini AI generation
│   │   ├── docs/page.tsx                     # This page
│   │   ├── launch/page.tsx                   # Token creation app
│   │   ├── layout.tsx                        # Root layout + providers
│   │   ├── page.tsx                          # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── AuthModal.tsx                     # Wallet + OAuth modal
│   │   ├── AuthSessionProvider.tsx           # NextAuth SessionProvider
│   │   ├── FeeSplitVisual.tsx                # Interactive fee bars
│   │   ├── GeneratingScreen.tsx              # AI loading animation
│   │   ├── HomeScreen.tsx                    # Cause input screen
│   │   ├── LaunchedScreen.tsx                # Post-launch dashboard
│   │   ├── Navbar.tsx                        # Header with auth state
│   │   ├── PreviewScreen.tsx                 # Token review screen
│   │   ├── ThemeProvider.tsx                 # next-themes wrapper
│   │   ├── ThemeToggle.tsx                   # Light/dark/system toggle
│   │   └── TickerBar.tsx                     # Live launches ticker
│   ├── lib/
│   │   ├── constants.ts                      # Static data & AI prompt
│   │   ├── mock-data.ts                      # Launches, examples, fee splits
│   │   ├── useAnimatedCounter.ts             # Animated number hook
│   │   └── utils.ts                          # cn(), formatCurrency(), etc.
│   └── types/index.ts                        # All TypeScript types
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json`} />

          {/* ════════════════════════════════════════════
              CORE CONCEPTS
          ════════════════════════════════════════════ */}

          <H2 id="how-it-works">How it works</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            The full user journey from cause description to live token takes four steps:
          </p>
          {[
            { n: "01", title: "User describes their cause", body: "A single text input on the launch page. The user types one sentence describing the community problem they want to solve — e.g. \"Solar panels for 200 homes in rural Ethiopia\". Example prompts are provided to lower the barrier." },
            { n: "02", title: "AI generates the token identity", body: "The cause text is sent to the Gemini API via a Next.js route. Gemini returns a JSON object containing a token name, ticker (4–6 capital letters), description, relevant emoji, cause wallet label, and a pre-written viral share hook." },
            { n: "03", title: "User reviews and launches", body: "The generated token is shown in a preview screen. The user can regenerate, edit their cause, or click Launch. In production this calls bagsSDK.launchToken() which deploys the token on Solana and registers the fee split configuration." },
            { n: "04", title: "Fees flow to the cause", body: "Every on-chain trade of the token triggers the fee split: 40% goes to a designated cause wallet, 30% is redistributed to all token holders as cashback, 20% goes to the creator, and 10% to the platform. No manual distribution needed." },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold text-brand-gold mt-0.5">{s.n}</div>
              <div>
                <h4 className="font-syne font-bold text-gray-900 dark:text-gray-100 mb-1">{s.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}

          <H2 id="fee-splits">Fee splits</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            The fee split is set once at token launch via the Bags SDK and applies automatically to every trade thereafter. The four recipients are:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { pct: "40%", color: "#3DDC84", label: "Cause wallet", desc: "On-chain wallet designated to fund the community project." },
              { pct: "30%", color: "#F5A623", label: "Holders", desc: "Distributed proportionally to all current token holders." },
              { pct: "20%", color: "#7EB8F7", label: "Creator", desc: "Sent to the wallet that launched the token." },
              { pct: "10%", color: "#B07EF7", label: "Platform", desc: "ImpactAI platform wallet for ongoing development." },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3 p-4 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-syne font-extrabold text-sm" style={{ backgroundColor: f.color + "22", color: f.color }}>{f.pct}</div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{f.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <Callout type="info">
            Fee splits are enforced by the Bags protocol on-chain. Once set at launch, they cannot be changed without redeploying the token.
          </Callout>

          <H2 id="token-launch">Token launch flow</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            In production, replace the mock <Code>setScreen("launched")</Code> call in <Code>src/app/launch/page.tsx</Code> with the real Bags SDK call:
          </p>
          <CodeBlock language="bash" code={`npm install @bagsfm/bags-sdk @solana/web3.js @solana/wallet-adapter-react`} />
          <CodeBlock language="typescript" code={`import { BagsSDK } from "@bagsfm/bags-sdk";

const sdk = new BagsSDK({ apiKey: process.env.BAGS_API_KEY });

const result = await sdk.launchToken({
  name: token.name,
  ticker: token.ticker,
  description: token.description,
  feeShares: {
    cause:    "0.40",  // 40% → community wallet
    holders:  "0.30",  // 30% → token holders
    creator:  "0.20",  // 20% → you
    platform: "0.10",  // 10% → ImpactAI
  },
  causeWallet: "SOLANA_WALLET_ADDRESS_FOR_CAUSE",
  metadata: {
    image: token.emoji,
    tags:  token.tags,
  },
});

console.log("Token live:", result.mintAddress);`} />

          {/* ════════════════════════════════════════════
              AUTH & WALLETS
          ════════════════════════════════════════════ */}

          <H2 id="wallet-connect">Wallet connection</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            The <Code>AuthModal</Code> component handles three Solana wallets by calling their browser extension APIs directly — no adapter library required:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-light-border dark:border-dark-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-light-surface2 dark:bg-dark-surface2 border-b border-light-border dark:border-dark-border">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Wallet</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Detection</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Connect call</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {[
                  ["Phantom",  "window.solana.isPhantom",    "window.solana.connect()"],
                  ["Solflare", "window.solflare.isSolflare", "window.solflare.connect()"],
                  ["Backpack", "window.xnft.solana",         "window.xnft.solana.connect()"],
                ].map(([w, d, c]) => (
                  <tr key={w} className="bg-light-surface dark:bg-dark-surface">
                    <td className="px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300">{w}</td>
                    <td className="px-4 py-3 font-mono text-xs text-brand-gold">{d}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-500">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            When a wallet is detected, the modal shows a green <strong>Detected</strong> badge. If not installed, it shows an install link to the wallet's website. After connecting, the public key is shortened and shown in the navbar.
          </p>

          <H2 id="oauth">OAuth — Google &amp; GitHub</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Social login uses <a href="https://next-auth.js.org" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">NextAuth.js v4</a> with JWT sessions (no database required).
          </p>

          <H3 id="google-setup">Setting up Google OAuth</H3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">console.cloud.google.com</a> and create a new project.</li>
            <li>Navigate to <strong>APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID</strong>.</li>
            <li>Set <strong>Application type</strong> to <em>Web application</em>.</li>
            <li>Add <Code>http://localhost:3000/api/auth/callback/google</Code> as an authorised redirect URI.</li>
            <li>Copy the Client ID and Client Secret into <Code>.env.local</Code>.</li>
          </ol>

          <H3 id="github-setup">Setting up GitHub OAuth</H3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            <li>Go to <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">github.com/settings/developers</a>.</li>
            <li>Click <strong>OAuth Apps → New OAuth App</strong>.</li>
            <li>Set the <strong>Authorization callback URL</strong> to <Code>http://localhost:3000/api/auth/callback/github</Code>.</li>
            <li>Click <strong>Register application</strong>, then generate a client secret.</li>
            <li>Copy both values into <Code>.env.local</Code>.</li>
          </ol>

          <Callout type="warning">
            For production deployments, update the callback URLs in both Google and GitHub consoles to use your live domain, e.g. <Code>https://impactai.vercel.app/api/auth/callback/google</Code>, and update <Code>NEXTAUTH_URL</Code> in your Vercel environment variables.
          </Callout>

          <H2 id="session">Session management</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            The app maintains two parallel auth states:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            <li><strong>NextAuth session</strong> — stored in a signed JWT cookie, persists across page loads. Read via <Code>useSession()</Code> in the Navbar.</li>
            <li><strong>Wallet state</strong> — stored in React state (<Code>useState</Code>), lives for the current tab session only. Managed by <Code>walletUser</Code> prop.</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            The Navbar renders the wallet user first, falling back to the NextAuth user if no wallet is connected:
          </p>
          <CodeBlock language="typescript" code={`const displayName =
  walletUser?.displayName ??   // wallet takes priority
  oauthUser?.name ??           // then NextAuth name
  oauthUser?.email?.split("@")[0];  // then email prefix`} />

          {/* ════════════════════════════════════════════
              API REFERENCE
          ════════════════════════════════════════════ */}

          <H2 id="api-generate">POST /api/generate</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            Route that calls the Gemini API and returns a structured token object.
          </p>
          <H3 id="generate-request">Request</H3>
          <CodeBlock language="json" code={`POST /api/generate
Content-Type: application/json

{
  "cause": "Solar panels for 200 homes in rural Ethiopia"
}`} />
          <H3 id="generate-response">Response</H3>
          <CodeBlock language="json" code={`{
  "token": {
    "name": "EthioSolar",
    "ticker": "ESOL",
    "description": "EthioSolar is lighting up 200 homes...",
    "emoji": "☀️",
    "causeWallet": "Solar panel installation for 200 rural homes",
    "viralHook": "I just launched a solar token — trade it and power Ethiopia",
    "tags": ["energy", "africa", "solar"]
  }
}`} />
          <H3 id="generate-errors">Errors</H3>
          <div className="overflow-x-auto rounded-2xl border border-light-border dark:border-dark-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-light-surface2 dark:bg-dark-surface2 border-b border-light-border dark:border-dark-border">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {[
                  ["400", "Cause text missing or under 5 characters"],
                  ["400", "Cause text over 300 characters"],
                  ["500", "GEMINI_API_KEY not set in environment"],
                  ["502", "Gemini API returned a non-200 response"],
                  ["500", "AI response could not be parsed as valid JSON"],
                ].map(([s, r]) => (
                  <tr key={r} className="bg-light-surface dark:bg-dark-surface">
                    <td className="px-4 py-3 font-mono text-xs text-red-500">{s}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2 id="api-auth">NextAuth routes</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            The catch-all handler at <Code>src/app/api/auth/[...nextauth]/route.ts</Code> exposes these endpoints automatically:
          </p>
          <CodeBlock language="text" code={`GET  /api/auth/signin              # Sign-in page redirect
GET  /api/auth/signout             # Signs the user out
GET  /api/auth/session             # Returns current session JSON
GET  /api/auth/callback/google     # Google OAuth callback
GET  /api/auth/callback/github     # GitHub OAuth callback
GET  /api/auth/csrf                # CSRF token`} />

          {/* ════════════════════════════════════════════
              DEPLOYMENT
          ════════════════════════════════════════════ */}

          <H2 id="deploy-vercel">Deploy to Vercel</H2>
          <CodeBlock language="bash" code={`# Install Vercel CLI
npm i -g vercel

# Deploy (first time sets up the project)
vercel

# Set environment variables
vercel env add GEMINI_API_KEY
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL          # https://your-app.vercel.app
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET

# Deploy to production
vercel --prod`} />
          <Callout type="warning">
            Remember to update your OAuth redirect URIs in the Google Cloud Console and GitHub developer settings to match your Vercel production URL before going live.
          </Callout>

          <H2 id="production">Production checklist</H2>
          <div className="flex flex-col gap-2 mb-6">
            {[
              ["Set NEXTAUTH_URL to your live domain", "critical"],
              ["Generate a strong NEXTAUTH_SECRET with openssl rand -base64 32", "critical"],
              ["Update Google OAuth redirect URI to production URL", "critical"],
              ["Update GitHub OAuth callback URL to production URL", "critical"],
              ["Add BAGS_API_KEY from dev.bags.fm", "required"],
              ["Replace mock launch with real bagsSDK.launchToken() call", "required"],
              ["Add a real cause wallet Solana address for fee routing", "required"],
              ["Set up IPFS or similar for proof-of-impact photo uploads", "optional"],
              ["Add rate limiting to /api/generate to prevent abuse", "optional"],
              ["Wire up a real database if you want persistent user data", "optional"],
            ].map(([item, level]) => (
              <div key={item} className="flex items-start gap-3 p-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1.5", level === "critical" ? "bg-red-500" : level === "required" ? "bg-brand-gold" : "bg-gray-300 dark:bg-gray-700")} />
                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                <span className={cn("ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0", level === "critical" ? "bg-red-100 dark:bg-red-950/30 text-red-500" : level === "required" ? "bg-brand-gold/10 text-brand-gold" : "bg-gray-100 dark:bg-gray-800 text-gray-400")}>
                  {level}
                </span>
              </div>
            ))}
          </div>

          <H2 id="bags-sdk">Wiring up Bags SDK</H2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
            The current codebase has a placeholder launch. Here is how to make it real:
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2"><strong>1. Install the SDK:</strong></p>
          <CodeBlock language="bash" code={`npm install @bagsfm/bags-sdk @solana/web3.js`} />
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2"><strong>2. In <Code>src/app/launch/page.tsx</Code>, find the <Code>handleLaunch</Code> function and replace it:</strong></p>
          <CodeBlock language="typescript" code={`const handleLaunch = useCallback(async () => {
  if (!user && !walletUser) { setAuthOpen(true); return; }

  const { BagsSDK } = await import("@bagsfm/bags-sdk");
  const sdk = new BagsSDK({ apiKey: process.env.NEXT_PUBLIC_BAGS_API_KEY });

  try {
    const result = await sdk.launchToken({
      name:        token!.name,
      ticker:      token!.ticker,
      description: token!.description,
      feeShares: {
        cause:    "0.40",
        holders:  "0.30",
        creator:  "0.20",
        platform: "0.10",
      },
      causeWallet: "YOUR_CAUSE_SOLANA_WALLET_ADDRESS",
    });
    console.log("Mint address:", result.mintAddress);
    setScreen("launched");
  } catch (err) {
    setError("Launch failed. Check your Bags API key.");
  }
}, [token, user, walletUser]);`} />

          {/* ── Footer ── */}
          <div className="mt-16 pt-8 border-t border-light-border dark:border-dark-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-syne font-extrabold text-base mb-1">
                  <span className="text-brand-gold">Impact</span>
                  <span className="text-brand-green">AI</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-600">Community tokens. Real change. Built for #BagsHackathon.</p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {[
                  ["https://dev.bags.fm", "Bags Docs"],
                  ["https://aistudio.google.com/app/apikey", "Gemini API"],
                  ["https://next-auth.js.org", "NextAuth"],
                  ["https://solana.com", "Solana"],
                ].map(([href, label]) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-gold transition-colors">
                    <ExternalLink size={10} />{label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* ── Right TOC (xl screens) ── */}
        <aside className="hidden xl:block w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-6 py-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">On this page</p>
          <div className="flex flex-col gap-1">
            {NAV_SECTIONS.flatMap(s => s.items).map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "text-xs py-1 transition-colors",
                  activeSection === item.id
                    ? "text-brand-gold font-medium"
                    : "text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
