import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.update({ where: { id }, data: { status: "ACTIVE" } });
  return NextResponse.json(project);
}
