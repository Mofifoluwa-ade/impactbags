import { NextRequest, NextResponse } from "next/server";
import type { GenerateApiResponse, GeneratedToken } from "@/types";
import { AI_GENERATE_PROMPT } from "@/lib/constants";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { cause } = (await req.json()) as { cause: string };

    if (!cause || cause.trim().length < 5) {
      return NextResponse.json<GenerateApiResponse>(
        { error: "Please describe your cause in at least a few words." },
        { status: 400 }
      );
    }

    if (cause.trim().length > 300) {
      return NextResponse.json<GenerateApiResponse>(
        { error: "Cause description is too long. Keep it under 300 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json<GenerateApiResponse>(
        { error: "ANTHROPIC_API_KEY not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: AI_GENERATE_PROMPT(cause.trim()),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", errData);
      return NextResponse.json<GenerateApiResponse>(
        { error: "AI generation failed. Check your API key and try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawText: string = data?.content?.[0]?.text ?? "";

    // Strip any markdown fences if the model wraps in ```json
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    const parsed = JSON.parse(cleaned) as GeneratedToken;

    // Validate required fields
    if (!parsed.name || !parsed.ticker || !parsed.description) {
      throw new Error("Incomplete token data from AI");
    }

    // Normalise ticker — uppercase, alphanumeric only
    parsed.ticker = parsed.ticker.replace(/[^A-Z0-9]/g, "").toUpperCase().slice(0, 6);

    return NextResponse.json<GenerateApiResponse>({ token: parsed });
  } catch (err) {
    console.error("Generate route error:", err);
    return NextResponse.json<GenerateApiResponse>(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
