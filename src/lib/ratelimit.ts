import { Redis } from "@upstash/redis";

// Reuse whichever Upstash env names are present (same fallback as the token
// store): STORAGE_*, the Vercel KV integration's KV_REST_API_*, or the raw
// UPSTASH_REDIS_REST_* names.
const url =
  process.env.STORAGE_URL ||
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.STORAGE_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number; // seconds until the window resets (best effort)
}

/**
 * Fixed-window rate limiter backed by Upstash Redis.
 *
 * Fails OPEN — if Redis isn't configured (e.g. local dev without storage) or a
 * Redis call errors, requests are allowed rather than blocked, so the limiter
 * can never take the feature down.
 */
export async function rateLimit(
  key: string,
  opts: { limit: number; windowSec: number }
): Promise<RateLimitResult> {
  const { limit, windowSec } = opts;
  if (!redis) return { ok: true, remaining: limit, retryAfter: 0 };

  const rk = `impactai:rl:${key}`;
  try {
    const count = await redis.incr(rk);
    if (count === 1) await redis.expire(rk, windowSec);
    if (count <= limit) {
      return { ok: true, remaining: limit - count, retryAfter: 0 };
    }
    const ttl = (await redis.ttl(rk)) ?? windowSec;
    return { ok: false, remaining: 0, retryAfter: ttl > 0 ? ttl : windowSec };
  } catch (err) {
    console.error("[ratelimit] error — failing open:", err);
    return { ok: true, remaining: limit, retryAfter: 0 };
  }
}
