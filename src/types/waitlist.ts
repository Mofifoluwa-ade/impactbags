export interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  role: string;          // "builder" | "community" | "investor" | "other"
  cause?: string;        // what they want to fund
  referral?: string;     // how they heard about us
  createdAt: string;     // ISO string
  ip?: string;
}

export interface WaitlistStats {
  total: number;
  today: number;
  thisWeek: number;
  byRole: Record<string, number>;
}
