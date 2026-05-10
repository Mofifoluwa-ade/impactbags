import { NextResponse } from "next/server";
import { getPlatformStats } from "@/lib/tokens";

export async function GET() {
  try {
    const stats = await getPlatformStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("GET /api/tokens/stats error:", err);
    // Return zeroed stats so the UI still renders
    return NextResponse.json({
      totalTokens: 0,
      totalRaised: 0,
      totalSupporters: 0,
      totalTx: 0,
      countries: 0,
    });
  }
}
