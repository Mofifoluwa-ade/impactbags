import { NextRequest, NextResponse } from "next/server";
import type { GenerateApiResponse, GeneratedToken } from "@/types";
import { AI_GENERATE_PROMPT } from "@/lib/constants";

// Standard Node.js runtime — required for outbound fetch to Gemini
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json<GenerateApiResponse>(
        { error: "GEMINI_API_KEY not configured on server." },
        { status: 500 }
      );
    }

    // Gemini 1.5 Flash — fast, free tier available, great for structured JSON output
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: AI_GENERATE_PROMPT(cause.trim()) }],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 800,
          responseMimeType: "application/json", // forces Gemini to return pure JSON
        },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text().catch(() => "");
      console.error("Gemini API error:", geminiRes.status, errBody);
      return NextResponse.json<GenerateApiResponse>(
        { error: `AI service returned ${geminiRes.status}. Check your Gemini API key.` },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();

    // Gemini response structure: candidates[0].content.parts[0].text
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!rawText) {
      console.error("Empty response from Gemini:", JSON.stringify(data));
      return NextResponse.json<GenerateApiResponse>(
        { error: "AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    // Strip any markdown fences just in case
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed: GeneratedToken;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Gemini JSON:", cleaned);
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
