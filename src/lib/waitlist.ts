import fs from "fs";
import path from "path";
import type { WaitlistEntry, WaitlistStats } from "@/types/waitlist";

// Vercel writable path — also works locally
const STORE_PATH = path.join("/tmp", "impactai-waitlist.json");

function readStore(): WaitlistEntry[] {
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(raw) as WaitlistEntry[];
  } catch {
    return [];
  }
}

function writeStore(entries: WaitlistEntry[]): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(entries, null, 2), "utf8");
}

export function getAllEntries(): WaitlistEntry[] {
  return readStore().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addEntry(entry: Omit<WaitlistEntry, "id" | "createdAt">): WaitlistEntry {
  const entries = readStore();

  // Deduplicate by email
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
  writeStore(entries);
  return newEntry;
}

export function getStats(): WaitlistStats {
  const entries = readStore();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;

  const byRole: Record<string, number> = {};
  let today = 0;
  let thisWeek = 0;

  for (const e of entries) {
    const t = new Date(e.createdAt).getTime();
    if (t >= todayStart) today++;
    if (t >= weekStart)  thisWeek++;
    byRole[e.role] = (byRole[e.role] ?? 0) + 1;
  }

  return { total: entries.length, today, thisWeek, byRole };
}

export function deleteEntry(id: string): boolean {
  const entries = readStore();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  writeStore(filtered);
  return true;
}

export function exportCSV(): string {
  const entries = readStore();
  const header = "id,name,email,role,cause,referral,createdAt";
  const rows = entries.map((e) =>
    [e.id, `"${e.name}"`, e.email, e.role, `"${e.cause ?? ""}"`, `"${e.referral ?? ""}"`, e.createdAt].join(",")
  );
  return [header, ...rows].join("\n");
}
