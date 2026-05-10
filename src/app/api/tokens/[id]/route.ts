import { NextRequest, NextResponse } from "next/server";
import { getToken, updateTokenStats, deleteToken } from "@/lib/tokens";
import { cookies } from "next/headers";

function isAdmin(): boolean {
  const session = cookies().get("admin_session")?.value;
  return !!process.env.ADMIN_PASSWORD && session === process.env.ADMIN_PASSWORD;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken(params.id);
  if (!token) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ token });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patch = await req.json();
    await updateTokenStats(params.id, patch);
    const token = await getToken(params.id);
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const deleted = await deleteToken(params.id);
  return NextResponse.json({ ok: deleted });
}
