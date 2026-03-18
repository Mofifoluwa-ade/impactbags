import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a creative crypto token naming AI for ImpactBags — a Nigerian community impact platform on Solana built on the Bags SDK.

Your job is to transform a user's community cause description into a compelling crypto token identity that feels both Web3-native and deeply rooted in Nigerian/African context.

Rules:
- Token names should be punchy, 2-3 words max, often capitalized
- Tickers: 3-6 letters, ALL CAPS, relevant abbreviation or acronym
- Descriptions: 2-3 sentences. Mix real urgency with crypto energy. Reference local Nigerian context (cities, states, communities) if mentioned
- Viral hook: under 90 characters, WhatsApp-ready, ends with excitement, suitable for Nigerian social media
- causeWallet: 5-8 words describing what the cause wallet funds (e.g. "Solar panels for Rumuola street residents")
- Pick an emoji that instantly communicates the cause

Always respond ONLY with a valid compact JSON object. No markdown, no backticks, no explanations, no extra whitespace outside the JSON.`;

const USER_TEMPLATE = (cause: string) => `Create a Bags token for this cause: "${cause}"

Respond with this exact JSON structure (no markdown, no backticks):
{"name":"Token name","ticker":"TICKER","description":"2-3 sentence description","emoji":"emoji","causeWallet":"What the cause wallet funds","viralHook":"WhatsApp-ready message under 90 chars"}`;

export async function POST(req: NextRequest) {
  try {
    const { cause } = await req.json();

    if (!cause || typeof cause !== "string" || cause.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid cause description." },
        { status: 400 }
      );
    }

    if (cause.length > 500) {
      return NextResponse.json(
        { error: "Cause description too long (max 500 chars)." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: USER_TEMPLATE(cause.trim()),
        },
      ],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    if (!raw) {
      throw new Error("Empty response from AI");
    }

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/```json|```/gi, "").trim();
    const parsed = JSON.parse(cleaned);

    // Validate required fields
    const required = [
      "name",
      "ticker",
      "description",
      "emoji",
      "causeWallet",
      "viralHook",
    ];
    for (const field of required) {
      if (!parsed[field]) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    // Sanitize
    parsed.ticker = parsed.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (parsed.ticker.length > 8) parsed.ticker = parsed.ticker.slice(0, 8);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[/api/generate] Error:", err);
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "AI returned invalid format. Please try again." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Token generation failed. Try again in a moment." },
      { status: 500 }
    );
  }
}
