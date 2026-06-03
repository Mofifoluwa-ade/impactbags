import type { FeeSplit, LiveLaunch } from "@/types";

export const FEE_SPLITS: FeeSplit[] = [
  { label: "Cause wallet", pct: 40, color: "#3DDC84", description: "Goes directly to fund the community project on-chain" },
  { label: "Holders (cashback)", pct: 30, color: "#F5A623", description: "Redistributed to every token holder on each trade" },
  { label: "You (creator)", pct: 20, color: "#7EB8F7", description: "Your reward for launching and growing the cause" },
  { label: "Platform fee", pct: 10, color: "#B07EF7", description: "Keeps ImpactAI running and building" },
];

export const LIVE_LAUNCHES: LiveLaunch[] = [
  { id: "1", emoji: "☀️", name: "SOLAR", ticker: "$SOLAR", cause: "Solar microgrids for rural Kenya", raised: 12470, supporters: 389, change24h: 14.2, country: "🇰🇪" },
  { id: "2", emoji: "📚", name: "EDUFUND", ticker: "$EDU", cause: "School libraries in rural Colombia", raised: 8920, supporters: 264, change24h: 8.7, country: "🇨🇴" },
  { id: "3", emoji: "💧", name: "CLEANH2O", ticker: "$H2O", cause: "Clean water wells in Bangladesh", raised: 21030, supporters: 843, change24h: 22.1, country: "🇧🇩" },
  { id: "4", emoji: "🌽", name: "FARMCO", ticker: "$FARM", cause: "Seeds & tools for Philippine farmers", raised: 4450, supporters: 131, change24h: -3.4, country: "🇵🇭" },
  { id: "5", emoji: "🏥", name: "MEDAID", ticker: "$MED", cause: "Medicines for clinics in Haiti", raised: 18910, supporters: 712, change24h: 17.3, country: "🇭🇹" },
  { id: "6", emoji: "🌳", name: "REFOREST", ticker: "$TREE", cause: "Reforestation in the Amazon basin", raised: 34200, supporters: 1204, change24h: 31.5, country: "🇧🇷" },
  { id: "7", emoji: "⚡", name: "POWERGRID", ticker: "$GRID", cause: "Electricity for off-grid villages in India", raised: 9100, supporters: 301, change24h: 6.2, country: "🇮🇳" },
  { id: "8", emoji: "🎓", name: "SCHOLAR", ticker: "$GRAD", cause: "University scholarships in Ghana", raised: 6780, supporters: 247, change24h: 11.8, country: "🇬🇭" },
];

export const EXAMPLE_CAUSES = [
  { emoji: "☀️", text: "Solar panels for 200 homes in rural Ethiopia" },
  { emoji: "💧", text: "Clean water wells for a village in rural Cambodia" },
  { emoji: "📚", text: "Build a library for an underfunded school in Bolivia" },
  { emoji: "🌳", text: "Plant 10,000 trees to restore deforested land in Indonesia" },
  { emoji: "🏥", text: "Stock medicines for a community clinic in rural Pakistan" },
  { emoji: "⚡", text: "Bring electricity to 50 off-grid families in Tanzania" },
];

export const AI_GENERATE_PROMPT = (cause: string) => `You are a creative crypto token naming AI for a global community impact platform called ImpactAI built on Solana.

A user wants to launch a community impact token for this cause: "${cause}"

Generate a compelling, globally resonant token. Respond ONLY with valid compact JSON (no markdown, no backticks, no extra text):

{"name":"Token name 2-3 words catchy","ticker":"TICKER 4-6 CAPS LETTERS","description":"2-3 punchy sentences. Mix crypto excitement with real human impact. Reference the specific region/context.","emoji":"one single relevant emoji","causeWallet":"Short phrase: exactly what the cause wallet funds 5-8 words","viralHook":"One punchy share message under 90 chars, no hashtags","tags":["tag1","tag2","tag3"]}`;

export const STATS = [
  { label: "Tokens launched", value: "2,847", suffix: "" },
  { label: "Total raised", value: "$4.2M", suffix: "" },
  { label: "Countries", value: "63", suffix: "+" },
  { label: "On-chain trades", value: "890K", suffix: "+" },
];

export const HOW_IT_WORKS = [
  { step: "01", title: "Describe your cause", desc: "Type one sentence about the community problem you want to solve. AI handles the rest." },
  { step: "02", title: "AI builds your token", desc: "Gemini generates a name, ticker, description, and viral share hook tailored to your cause." },
  { step: "03", title: "Launch on Solana", desc: "One click deploys your token via the Bags SDK. No smart contract knowledge needed." },
  { step: "04", title: "Fees fund the cause", desc: "Every trade auto-splits fees: 40% to your cause wallet, 30% to holders, 20% to you." },
];

export const CATEGORIES = [
  { emoji: "☀️", label: "Clean Energy" },
  { emoji: "💧", label: "Clean Water" },
  { emoji: "📚", label: "Education" },
  { emoji: "🌳", label: "Environment" },
  { emoji: "🏥", label: "Healthcare" },
  { emoji: "🌾", label: "Food Security" },
  { emoji: "🏠", label: "Housing" },
  { emoji: "⚡", label: "Infrastructure" },
];
