import { Redis } from "@upstash/redis";
import type { LiveToken, PlatformStats } from "@/types/token";

const redis = new Redis({
  url: process.env.STORAGE_URL!,
  token: process.env.STORAGE_TOKEN!,
});

const TOKENS_KEY   = "impactai:tokens";      // sorted set: score=createdAt ts, member=id
const TOKEN_PREFIX = "impactai:token:";       // hash per token
const STATS_KEY    = "impactai:stats";

// ── Write ─────────────────────────────────────────────────────────────────────

export async function saveToken(token: LiveToken): Promise<void> {
  const score = new Date(token.createdAt).getTime();
  await Promise.all([
    redis.zadd(TOKENS_KEY, { score, member: token.id }),
    redis.set(`${TOKEN_PREFIX}${token.id}`, JSON.stringify(token)),
  ]);
}

export async function updateTokenStats(
  id: string,
  patch: Partial<Pick<LiveToken, "raised" | "supporters" | "volume24h" | "change24h" | "txCount" | "proofPhotos" | "mintAddress">>
): Promise<void> {
  const raw = await redis.get<string>(`${TOKEN_PREFIX}${id}`);
  if (!raw) return;
  const token: LiveToken = typeof raw === "string" ? JSON.parse(raw) : raw;
  const updated = { ...token, ...patch };
  await redis.set(`${TOKEN_PREFIX}${id}`, JSON.stringify(updated));
}

export async function addProofPhoto(id: string, url: string): Promise<void> {
  const raw = await redis.get<string>(`${TOKEN_PREFIX}${id}`);
  if (!raw) return;
  const token: LiveToken = typeof raw === "string" ? JSON.parse(raw) : raw;
  token.proofPhotos = [...(token.proofPhotos ?? []), url];
  await redis.set(`${TOKEN_PREFIX}${id}`, JSON.stringify(token));
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getAllTokens(): Promise<LiveToken[]> {
  // Get all IDs ordered by newest first
  const ids = await redis.zrange(TOKENS_KEY, 0, -1, { rev: true });
  if (!ids || ids.length === 0) return [];

  const raws = await Promise.all(
    ids.map((id) => redis.get<string>(`${TOKEN_PREFIX}${id}`))
  );

  return raws
    .filter(Boolean)
    .map((r) => (typeof r === "string" ? JSON.parse(r) : r) as LiveToken);
}

export async function getToken(id: string): Promise<LiveToken | null> {
  const raw = await redis.get<string>(`${TOKEN_PREFIX}${id}`);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export async function getTokenCount(): Promise<number> {
  return (await redis.zcard(TOKENS_KEY)) ?? 0;
}

// ── Platform stats ────────────────────────────────────────────────────────────

export async function getPlatformStats(): Promise<PlatformStats> {
  const tokens = await getAllTokens();
  const countriesSet = new Set(tokens.map((t) => t.country).filter(Boolean));

  return {
    totalTokens:    tokens.length,
    totalRaised:    tokens.reduce((s, t) => s + (t.raised ?? 0), 0),
    totalSupporters: tokens.reduce((s, t) => s + (t.supporters ?? 0), 0),
    totalTx:        tokens.reduce((s, t) => s + (t.txCount ?? 0), 0),
    countries:      countriesSet.size,
  };
}

export async function deleteToken(id: string): Promise<boolean> {
  const [removed] = await Promise.all([
    redis.zrem(TOKENS_KEY, id),
    redis.del(`${TOKEN_PREFIX}${id}`),
  ]);
  return removed === 1;
}
