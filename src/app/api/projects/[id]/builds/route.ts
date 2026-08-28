import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { version, notes } = body ?? {};

  if (!version || typeof version !== "string" || !version.trim()) {
    return NextResponse.json({ error: "version is required" }, { status: 400 });
  }

  const build = await prisma.build.create({
    data: {
      projectId: id,
      version: version.trim(),
      notes: notes && String(notes).trim() ? String(notes).trim() : null,
    },
  });

  return NextResponse.json(build, { status: 201 });
}
