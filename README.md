# ImpactBags — Community Tokens, Real Change

Turn any Nigerian community cause into a Solana token in 60 seconds. AI names it, Bags SDK launches it, fees fund the cause automatically.

Built for the [Bags Hackathon](https://bags.fm) — targeting **AI Agents + Fee Sharing + Social Finance** categories.

---

## What it does

1. **Type your cause** — "Solar panels for my street in Port Harcourt"
2. **AI generates** — Token name, ticker, description, viral hook (Claude API)
3. **Launch on Bags** — One call to `bagsSDK.launchToken()` with auto fee splits
4. **Fees auto-split** — 40% cause wallet · 30% holders · 20% creator · 10% platform
5. **Share & go viral** — WhatsApp/X buttons with pre-written hooks

---

## Quick start

```bash
git clone <this-repo>
cd impactbags
npm install

cp .env.local.example .env.local
# Add ANTHROPIC_API_KEY to .env.local

npm run dev
# Open http://localhost:3000
```

---

## Environment variables

```
ANTHROPIC_API_KEY=sk-ant-...     # Required — console.anthropic.com
BAGS_API_KEY=...                  # Required for production launch — dev.bags.fm
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
    platform: "0.10",   // → ImpactBags
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
│   ├── layout.tsx          # Root layout + fonts + ThemeProvider
│   ├── page.tsx            # Main page — orchestrates all screens
│   ├── globals.css         # Tailwind + custom CSS
│   └── api/generate/
│       └── route.ts        # Edge API route → Anthropic Claude
├── components/
│   ├── Navbar.tsx          # Header + theme toggle + wallet connect
│   ├── Footer.tsx          # Footer links
│   ├── ThemeProvider.tsx   # next-themes wrapper
│   ├── ThemeToggle.tsx     # Light / Dark / System switcher
│   ├── TickerBar.tsx       # Live launches scrolling ticker
│   ├── LiveLaunchesList.tsx # Home screen live launches list
│   ├── FeeSplitVisual.tsx  # Interactive fee split bars
│   ├── HomeScreen.tsx      # Step 1: cause input
│   ├── GeneratingScreen.tsx # Loading animation
│   ├── PreviewScreen.tsx   # Step 2: review token
│   └── LaunchedScreen.tsx  # Step 3: live dashboard
├── lib/
│   ├── constants.ts        # Fee splits, example causes, AI prompt
│   ├── utils.ts            # cn(), formatCurrency(), share URLs
│   └── useAnimatedCounter.ts # Animated number hook
└── types/
    └── index.ts            # TypeScript types
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
| AI | Google Gemini (gemini-1.5-flash) |
| Blockchain | Solana via Bags SDK |
| Deploy | Vercel (free tier) |

---

## Deploy to Vercel

```bash
npx vercel --prod
# Set ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables
```

---

Made with ♥ for Nigerian communities. Built for #BagsHackathon.
