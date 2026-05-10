import { NextRequest, NextResponse } from "next/server";
import { addEntry } from "@/lib/waitlist";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, role, cause, referral } = body as Record<string, string>;

    if (!email || !name || !role) {
      return NextResponse.json({ error: "Name, email and role are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? undefined;

    const entry = addEntry({ email: email.toLowerCase().trim(), name: name.trim(), role, cause, referral, ip });
    return NextResponse.json({ ok: true, position: entry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
