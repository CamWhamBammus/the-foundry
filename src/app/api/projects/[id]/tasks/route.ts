import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { TaskType } from "@/types";

const TASK_TYPES: TaskType[] = ["FEATURE", "BUG", "ASSET", "POLISH"];

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { title, type } = body ?? {};

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!TASK_TYPES.includes(type)) {
    return NextResponse.json({ error: "type must be one of " + TASK_TYPES.join(", ") }, { status: 400 });
  }

  const last = await prisma.task.findFirst({
    where: { projectId: id, type },
    orderBy: { order: "desc" },
  });

  const task = await prisma.task.create({
    data: {
      projectId: id,
      title: title.trim(),
      type,
      order: (last?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
