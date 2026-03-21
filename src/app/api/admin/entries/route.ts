import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllEntries, deleteEntry, exportCSV, getStats } from "@/lib/waitlist";

function isAuthed(): boolean {
  const session = cookies().get("admin_session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;
  return !!adminPassword && session === adminPassword;
}

export async function GET(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  // CSV export
  if (searchParams.get("format") === "csv") {
    const csv = exportCSV();
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="waitlist-${Date.now()}.csv"`,
      },
    });
  }

  const entries = getAllEntries();
  const stats = getStats();
  return NextResponse.json({ entries, stats });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const deleted = deleteEntry(id);
  return NextResponse.json({ ok: deleted });
}
