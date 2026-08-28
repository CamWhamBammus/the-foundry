import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const INCLUDE = {
  milestones: { orderBy: { order: "asc" as const } },
  tasks: { orderBy: { order: "asc" as const } },
  devlogEntries: { orderBy: { date: "desc" as const } },
  builds: { orderBy: { date: "desc" as const } },
  linkedBooks: true,
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: INCLUDE });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { title, description, engine, genre, targetDate } = body ?? {};

  const data: {
    title?: string;
    description?: string | null;
    engine?: string | null;
    genre?: string | null;
    targetDate?: Date | null;
  } = {};

  if (title !== undefined) data.title = String(title).trim();
  if (description !== undefined) data.description = description && String(description).trim() ? String(description).trim() : null;
  if (engine !== undefined) data.engine = engine && String(engine).trim() ? String(engine).trim() : null;
  if (genre !== undefined) data.genre = genre && String(genre).trim() ? String(genre).trim() : null;
  if (targetDate !== undefined) data.targetDate = targetDate ? new Date(targetDate) : null;

  const project = await prisma.project.update({ where: { id }, data, include: INCLUDE });
  return NextResponse.json(project);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
