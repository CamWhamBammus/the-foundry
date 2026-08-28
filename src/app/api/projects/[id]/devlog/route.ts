import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entries = await prisma.devlogEntry.findMany({ where: { projectId: id }, orderBy: { date: "desc" } });
  return NextResponse.json(entries);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { kind, body: entryBody, date } = body ?? {};

  if (!entryBody || typeof entryBody !== "string" || !entryBody.trim()) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  const entry = await prisma.devlogEntry.create({
    data: {
      projectId: id,
      kind: kind ?? "NOTE",
      body: entryBody.trim(),
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
