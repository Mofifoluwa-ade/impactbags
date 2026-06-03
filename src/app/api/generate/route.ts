import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { GenerateApiResponse, GeneratedToken } from "@/types";
import { AI_GENERATE_PROMPT } from "@/lib/constants";

// Standard Node.js runtime — required for outbound fetch to the Claude API
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

    // Use a project-specific key var (IMPACTBAGS_ANTHROPIC_KEY) so it never
    // collides with a global ANTHROPIC_API_KEY/ANTHROPIC_BASE_URL that may be
    // set in the shell for other tooling (e.g. Claude Code). Fall back to the
    // standard ANTHROPIC_API_KEY for deploy environments where there's no clash.
    const apiKey =
      process.env.IMPACTBAGS_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("IMPACTBAGS_ANTHROPIC_KEY / ANTHROPIC_API_KEY is not set");
      return NextResponse.json<GenerateApiResponse>(
        { error: "Anthropic API key not configured on server." },
        { status: 500 }
      );
    }

    // Always hit the official Anthropic endpoint — deliberately ignore any
    // ANTHROPIC_BASE_URL in the environment so a gateway meant for other tools
    // can't intercept these requests.
    const client = new Anthropic({ apiKey, baseURL: "https://api.anthropic.com" });

    // Structured outputs guarantee the response matches this schema — no
    // fragile markdown-fence stripping or hand-rolled JSON parsing needed.
    const TOKEN_SCHEMA = {
      type: "object",
      properties: {
        name: { type: "string" },
        ticker: { type: "string" },
        description: { type: "string" },
        emoji: { type: "string" },
        causeWallet: { type: "string" },
        viralHook: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
      },
      required: [
        "name",
        "ticker",
        "description",
        "emoji",
        "causeWallet",
        "viralHook",
        "tags",
      ],
      additionalProperties: false,
    } as const;

    let response;
    try {
      response = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        // Fast, creative one-shot generation — no extended reasoning needed.
        thinking: { type: "disabled" },
        output_config: {
          format: { type: "json_schema", schema: TOKEN_SCHEMA },
        },
        messages: [{ role: "user", content: AI_GENERATE_PROMPT(cause.trim()) }],
      });
    } catch (err) {
      if (err instanceof Anthropic.APIError) {
        console.error("Claude API error:", err.status, err.message);
        return NextResponse.json<GenerateApiResponse>(
          { error: `AI service returned ${err.status}. Check your Anthropic API key.` },
          { status: 502 }
        );
      }
      throw err;
    }

    if (response.stop_reason === "refusal") {
      console.error("Claude refused the request:", JSON.stringify(response.stop_details));
      return NextResponse.json<GenerateApiResponse>(
        { error: "AI declined to generate for this cause. Please rephrase and try again." },
        { status: 502 }
      );
    }

    const rawText = response.content.find((b) => b.type === "text")?.text ?? "";

    if (!rawText) {
      console.error("Empty response from Claude:", JSON.stringify(response));
      return NextResponse.json<GenerateApiResponse>(
        { error: "AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    let parsed: GeneratedToken;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error("Failed to parse Claude JSON:", rawText);
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
