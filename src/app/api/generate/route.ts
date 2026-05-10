import { NextRequest, NextResponse } from "next/server";
import type { GenerateApiResponse, GeneratedToken } from "@/types";
import { AI_GENERATE_PROMPT } from "@/lib/constants";

// NO edge runtime — standard Node.js so Vercel can reach external APIs reliably
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json<GenerateApiResponse>(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { cause } = body as { cause: string };

    if (!cause || cause.trim().length < 5) {
      return NextResponse.json<GenerateApiResponse>(
        { error: "Please describe your cause in at least a few words." },
        { status: 400 }
      );
    }
    if (cause.trim().length > 300) {
      return NextResponse.json<GenerateApiResponse>(
        { error: "Keep it under 300 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json<GenerateApiResponse>(
        { error: "ANTHROPIC_API_KEY not configured on server." },
        { status: 500 }
      );
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // fast + cheap — good for token generation
        max_tokens: 800,
        messages: [{ role: "user", content: AI_GENERATE_PROMPT(cause.trim()) }],
      }),
    });

    // Log the actual error from Anthropic to help debug
    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text().catch(() => "");
      console.error("Anthropic API error:", anthropicRes.status, errBody);
      return NextResponse.json<GenerateApiResponse>(
        { error: `AI service returned ${anthropicRes.status}. Check your API key and billing.` },
        { status: 502 }
      );
    }

    const data = await anthropicRes.json();
    const rawText: string = data?.content?.[0]?.text ?? "";

    if (!rawText) {
      console.error("Empty response from Anthropic:", data);
      return NextResponse.json<GenerateApiResponse>(
        { error: "AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    // Strip markdown fences if model wraps in ```json
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed: GeneratedToken;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse AI JSON:", cleaned);
      return NextResponse.json<GenerateApiResponse>(
        { error: "AI response could not be parsed. Please try again." },
        { status: 502 }
      );
    }

    if (!parsed.name || !parsed.ticker) {
      return NextResponse.json<GenerateApiResponse>(
        { error: "AI response was incomplete. Please try again." },
        { status: 502 }
      );
    }

    // Sanitise ticker
    parsed.ticker = parsed.ticker
      .replace(/[^A-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);

    return NextResponse.json<GenerateApiResponse>({ token: parsed });
  } catch (err) {
    console.error("Generate route unhandled error:", err);
    return NextResponse.json<GenerateApiResponse>(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
