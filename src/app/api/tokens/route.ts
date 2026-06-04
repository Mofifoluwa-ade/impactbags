import { NextRequest, NextResponse } from "next/server";
import { getAllTokens, saveToken } from "@/lib/tokens";
import type { LiveToken } from "@/types/token";

export async function GET() {
  try {
    const tokens = await getAllTokens();
    return NextResponse.json({ tokens });
  } catch (err) {
    console.error("GET /api/tokens error:", err);
    return NextResponse.json({ tokens: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<LiveToken>;

    if (!body.name || !body.ticker) {
      return NextResponse.json({ error: "name and ticker are required" }, { status: 400 });
    }

    const token: LiveToken = {
      id:             Math.random().toString(36).slice(2, 10),
      name:           body.name,
      ticker:         body.ticker.toUpperCase(),
      emoji:          body.emoji ?? "🌍",
      description:    body.description ?? "",
      causeWallet:    body.causeWallet ?? "",
      viralHook:      body.viralHook ?? "",
      tags:           body.tags ?? [],
      mintAddress:    body.mintAddress,
      raised:         0,
      supporters:     0,
      volume24h:      0,
      change24h:      0,
      txCount:        0,
      creatorId:      body.creatorId,
      creatorWallet:  body.creatorWallet,
      creatorDisplay: body.creatorDisplay,
      proofPhotos:    [],
      country:        body.country,
      category:       body.category,
      createdAt:      new Date().toISOString(),
    };

    await saveToken(token);
    return NextResponse.json({ token }, { status: 201 });
  } catch (err) {
    console.error("POST /api/tokens error:", err);
    // TEMP DEBUG: surface the underlying reason so storage misconfig is visible.
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Failed to save token", detail }, { status: 500 });
  }
}
