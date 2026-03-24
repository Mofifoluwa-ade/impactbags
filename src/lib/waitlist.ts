import { Redis } from "@upstash/redis";
import type { WaitlistEntry, WaitlistStats } from "@/types/waitlist";

const redis = new Redis({
  url: process.env.STORAGE_URL!,
  token: process.env.STORAGE_TOKEN!,
});

async function readStore(): Promise<WaitlistEntry[]> {
  const entries = await redis.get<WaitlistEntry[]>("waitlist");
  return entries ?? [];
}

async function writeStore(entries: WaitlistEntry[]): Promise<void> {
  await redis.set("waitlist", entries);
}

export async function getAllEntries(): Promise<WaitlistEntry[]> {
  const entries = await readStore();
  return entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addEntry(entry: Omit<WaitlistEntry, "id" | "createdAt">): Promise<WaitlistEntry> {
  const entries = await readStore();
  const existing = entries.find(
    (e) => e.email.toLowerCase() === entry.email.toLowerCase()
  );
  if (existing) return existing;

  const newEntry: WaitlistEntry = {
    ...entry,
    id: Math.random().toString(36).slice(2, 10),
    createdAt: new Date().toISOString(),
  };

  entries.push(newEntry);
  await writeStore(entries);
  return newEntry;
}

export async function getStats(): Promise<WaitlistStats> {
  const entries = await readStore();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;

  const byRole: Record<string, number> = {};
  let today = 0;
  let thisWeek = 0;

  for (const e of entries) {
    const t = new Date(e.createdAt).getTime();
    if (t >= todayStart) today++;
    if (t >= weekStart) thisWeek++;
    byRole[e.role] = (byRole[e.role] ?? 0) + 1;
  }

  return { total: entries.length, today, thisWeek, byRole };
}

export async function deleteEntry(id: string): Promise<boolean> {
  const entries = await readStore();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  await writeStore(filtered);
  return true;
}

export async function exportCSV(): Promise<string> {
  const entries = await readStore();
  const header = "id,name,email,role,cause,referral,createdAt";
  const rows = entries.map((e) =>
    [e.id, `"${e.name}"`, e.email, e.role, `"${e.cause ?? ""}"`, `"${e.referral ?? ""}"`, e.createdAt].join(",")
  );
  return [header, ...rows].join("\n");
}