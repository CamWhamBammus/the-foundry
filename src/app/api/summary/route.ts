import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { FoundrySummary } from "@/lib/api-client";

export async function GET() {
  const [active, paused, shipped, abandoned, openTasks] = await Promise.all([
    prisma.project.count({ where: { status: "ACTIVE" } }),
    prisma.project.count({ where: { status: "PAUSED" } }),
    prisma.project.count({ where: { status: "SHIPPED" } }),
    prisma.project.count({ where: { status: "ABANDONED" } }),
    prisma.task.count({ where: { status: { not: "DONE" } } }),
  ]);

  const summary: FoundrySummary = {
    totalProjects: active + paused + shipped + abandoned,
    active,
    paused,
    shipped,
    abandoned,
    openTasks,
  };

  return NextResponse.json(summary);
}
