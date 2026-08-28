import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { TaskStatus, TaskType } from "@/types";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { title, type, status, order } = body ?? {};

  const data: { title?: string; type?: TaskType; status?: TaskStatus; order?: number } = {};

  if (title !== undefined) data.title = String(title).trim();
  if (type !== undefined) data.type = type as TaskType;
  if (status !== undefined) data.status = status as TaskStatus;
  if (order !== undefined) data.order = Number(order);

  const task = await prisma.task.update({ where: { id }, data });
  return NextResponse.json(task);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
