import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tags: only tags that are used by at least one note
export async function GET() {
  const tags = await prisma.tag.findMany({
    where: { notes: { some: {} } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(tags);
}
