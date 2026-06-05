# Impact Ai— Community Tokens, Real Change

Turn any Nigerian community cause into a Solana token in 60 seconds. AI names it, Bags SDK launches it, fees fund the cause automatically.

Built for the [Bags Hackathon](https://bags.fm) — targeting **AI Agents + Fee Sharing + Social Finance** categories.

---

## What it does

1. **Type your cause** — "Solar panels for my street in Port Harcourt"
2. **AI generates** — Token name, ticker, description, viral hook (Gemini API)
3. **Launch on Bags** — One call to `bagsSDK.launchToken()` with auto fee splits
4. **Fees auto-split** — 40% cause wallet · 30% holders · 20% creator · 10% platform
5. **Share & go viral** — WhatsApp/X buttons with pre-written hooks
6. **Track your launches** — Every launch is saved (Upstash Redis) and shown live on the home feed and the creator's `/portfolio`

---

## Quick start

```bash
git clone <this-repo>
cd impactai
npm install

cp .env.local.example .env.local
# Add GEMINI_API_KEY (required) and, for token persistence,
# KV_REST_API_URL + KV_REST_API_TOKEN (Upstash / Vercel KV)

npm run dev
# Open http://localhost:3000
```

> The app runs without storage configured — token persistence and rate limiting just no-op until you add an Upstash/KV store.

---

## Environment variables

```
GEMINI_API_KEY=...               # Required — aistudio.google.com/app/apikey
NEXTAUTH_SECRET=...              # Required — openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Storage — Upstash Redis / Vercel KV (token persistence + rate limiting).
# STORAGE_URL/STORAGE_TOKEN and UPSTASH_REDIS_REST_* are also accepted.
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# Optional — social login (NextAuth)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

BAGS_API_KEY=...                  # Optional — production token launch (dev.bags.fm)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Production: wire up the Bags SDK

```bash
npm install @bagsfm/bags-sdk @solana/web3.js @solana/wallet-adapter-react
```

In `src/components/LaunchedScreen.tsx`, replace the mock launch with:

```typescript
import { BagsSDK } from "@bagsfm/bags-sdk";

const sdk = new BagsSDK({ apiKey: process.env.BAGS_API_KEY });

const result = await sdk.launchToken({
  name: token.name,
  ticker: token.ticker,
  description: token.description,
  feeShares: {
    cause: "0.40",      // → community wallet
    holders: "0.30",    // → token holders cashback
    creator: "0.20",    // → launcher
    platform: "0.10",   // → Impact Ai
  },
  causeWallet: "SOLANA_WALLET_ADDRESS_FOR_CAUSE",
  metadata: {
    image: token.emoji,
    tags: token.tags,
  },
});
```

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + fonts + providers
│   ├── page.tsx            # Landing page
│   ├── launch/page.tsx     # Token creation flow (describe → preview → launch)
│   ├── portfolio/page.tsx  # Creator's launched tokens + stats
│   ├── docs/page.tsx       # In-app documentation
│   ├── globals.css         # Tailwind + custom CSS
│   └── api/
│       ├── generate/route.ts   # Gemini AI generation (sanitized + rate-limited)
│       ├── tokens/route.ts     # GET list / POST save tokens
│       ├── tokens/[id]/route.ts# GET / PATCH a single token
│       ├── tokens/stats/route.ts # Aggregate platform stats
│       └── auth/[...nextauth]/route.ts # NextAuth handler
├── components/
│   ├── Navbar.tsx          # Header + theme toggle + wallet connect
│   ├── AuthModal.tsx       # Wallet + OAuth sign-in modal
│   ├── ThemeToggle.tsx     # Light / Dark / System switcher
│   ├── TickerBar.tsx       # Live launches scrolling ticker
│   ├── LiveLaunchesList.tsx # Home screen live launches list
│   ├── FeeSplitVisual.tsx  # Interactive fee split bars
│   ├── HomeScreen.tsx      # Step 1: cause input
│   ├── GeneratingScreen.tsx # Loading animation
│   ├── PreviewScreen.tsx   # Step 2: review token
│   └── LaunchedScreen.tsx  # Step 3: live dashboard (saves token)
├── lib/
│   ├── constants.ts        # Fee splits, example causes, AI prompt
│   ├── tokens.ts           # Upstash Redis token store + stats
│   ├── ratelimit.ts        # Upstash rate limiter (fail-open)
│   ├── useConnectedUser.ts # Unified wallet + OAuth identity (creatorIdOf)
│   ├── utils.ts            # cn(), formatCurrency(), share URLs
│   └── useAnimatedCounter.ts # Animated number hook
└── types/
    ├── index.ts            # App + UI types
    └── token.ts            # LiveToken & PlatformStats
```

---

## Traction hacks (win the hackathon)

- Launch your own `$IMPACT` token first → creates real volume
- Post in Port Harcourt WhatsApp groups: "Free solar for your street? 60 seconds → [link]"
- Every launch = real Bags on-chain volume → judges see it in the dashboard
- 100 winners chosen on real traction (volume, traders, app usage)

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Theming | next-themes |
| AI | Google Gemini (gemini-2.5-flash) |
| Blockchain | Solana via Bags SDK |
| Deploy | Vercel (free tier) |

---

## Deploy to Vercel

```bash
npx vercel --prod
# In Vercel → Settings → Environment Variables, set GEMINI_API_KEY, NEXTAUTH_SECRET,
# NEXTAUTH_URL, and connect an Upstash/KV store (injects KV_REST_API_URL/TOKEN).
```

> ⚠️ Vercel does **not** auto-redeploy when you change env vars — trigger a fresh deployment so new values (e.g. storage) take effect.

---

Made with ♥ for Nigerian communities. Built for #BagsHackathon.
