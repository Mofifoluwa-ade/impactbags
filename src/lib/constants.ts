import type { FeeSplit, LiveLaunch } from "@/types";

export const FEE_SPLITS: FeeSplit[] = [
  {
    label: "Cause wallet",
    pct: 40,
    color: "#3DDC84",
    description: "Goes directly to fund the community project",
    walletType: "cause",
  },
  {
    label: "Holders (cashback)",
    pct: 30,
    color: "#F5A623",
    description: "Redistributed to token holders on every trade",
    walletType: "holders",
  },
  {
    label: "You (creator)",
    pct: 20,
    color: "#7EB8F7",
    description: "Your earnings for launching the cause",
    walletType: "creator",
  },
  {
    label: "Platform fee",
    pct: 10,
    color: "#B07EF7",
    description: "Keeps ImpactBags running",
    walletType: "platform",
  },
];

export const LIVE_LAUNCHES: LiveLaunch[] = [
  {
    id: "1",
    emoji: "☀️",
    name: "SOLAR",
    ticker: "$SOLAR",
    cause: "Solar panels for Rumuola Street, PH",
    raised: 1247,
    supporters: 89,
    change24h: 14.2,
  },
  {
    id: "2",
    emoji: "📚",
    name: "DIOBU",
    ticker: "$DIOBU",
    cause: "School fees for 10 kids in Diobu",
    raised: 892,
    supporters: 64,
    change24h: 8.7,
  },
  {
    id: "3",
    emoji: "💧",
    name: "CLEANH2O",
    ticker: "$H2O",
    cause: "Boreholes for clean water in Ogoni",
    raised: 2103,
    supporters: 143,
    change24h: 22.1,
  },
  {
    id: "4",
    emoji: "🌽",
    name: "FARMNAIJA",
    ticker: "$FARM",
    cause: "Fertilizers for Plateau State farmers",
    raised: 445,
    supporters: 31,
    change24h: -3.4,
  },
  {
    id: "5",
    emoji: "🛣️",
    name: "ROADFIX",
    ticker: "$ROAD",
    cause: "Pothole repair, GRA Phase 2 PH",
    raised: 678,
    supporters: 47,
    change24h: 5.9,
  },
  {
    id: "6",
    emoji: "🏥",
    name: "CLINICPH",
    ticker: "$CLINIC",
    cause: "Medical supplies for Rumuigbo clinic",
    raised: 1891,
    supporters: 112,
    change24h: 17.3,
  },
];

export const EXAMPLE_CAUSES = [
  { emoji: "☀️", text: "Launch a token to buy solar panels for my street in Rumuola, Port Harcourt" },
  { emoji: "📚", text: "Fund school fees for 10 kids in Diobu, Rivers State" },
  { emoji: "💧", text: "Boreholes for clean water in Ogoni communities" },
  { emoji: "🌽", text: "Fertilizers and seeds for Plateau State subsistence farmers" },
  { emoji: "🛣️", text: "Fix the pothole on my street in GRA Phase 2 before rainy season" },
  { emoji: "🏥", text: "Stock medical supplies for the local clinic in Rumuigbo" },
];

export const AI_GENERATE_PROMPT = (cause: string) => `You are a creative crypto token naming AI for a Nigerian community impact platform called ImpactBags built on Solana.

A user wants to launch a community impact token for this cause: "${cause}"

Generate a compelling token with Nigerian/African cultural flavor where relevant. Respond ONLY with valid compact JSON (no markdown, no backticks, no extra text before or after):

{"name":"Token name 2-3 words catchy punchy","ticker":"TICKER 4-6 CAPS LETTERS NO SPACES","description":"2-3 punchy sentences. Mix crypto excitement with real community impact. Reference Nigeria or local context if relevant. Make it emotional and compelling.","emoji":"one single relevant emoji character","causeWallet":"Short phrase: exactly what the cause wallet funds 5-8 words","viralHook":"One punchy WhatsApp/X-ready share message under 90 chars no hashtags","tags":["tag1","tag2","tag3"]}`;
