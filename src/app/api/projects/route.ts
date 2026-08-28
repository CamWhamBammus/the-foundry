import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const INCLUDE = {
  milestones: { orderBy: { order: "asc" as const } },
  tasks: { orderBy: { order: "asc" as const } },
  devlogEntries: { orderBy: { date: "desc" as const } },
  builds: { orderBy: { date: "desc" as const } },
  linkedBooks: true,
};

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: INCLUDE,
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { title, description, engine, genre, targetDate, linkedBookIds } = body ?? {};

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const bookIds = Array.isArray(linkedBookIds) ? linkedBookIds.filter((v) => typeof v === "string" && v) : [];

  const project = await prisma.project.create({
    data: {
      title: title.trim(),
      description: description && String(description).trim() ? String(description).trim() : null,
      engine: engine && String(engine).trim() ? String(engine).trim() : null,
      genre: genre && String(genre).trim() ? String(genre).trim() : null,
      targetDate: targetDate ? new Date(targetDate) : null,
      linkedBooks: bookIds.length > 0 ? { create: bookIds.map((textbookId) => ({ textbookId })) } : undefined,
    },
    include: INCLUDE,
  });

  return NextResponse.json(project, { status: 201 });
}
