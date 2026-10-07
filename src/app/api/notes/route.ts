import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createNoteSchema } from "@/lib/validations";
import { noteInclude, tagsConnectOrCreate } from "@/lib/notes";

// GET /api/notes?q=text&tag=work
// Both are optional. q searches title and content, tag keeps notes with that tag.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const tag = searchParams.get("tag")?.trim().toLowerCase() ?? "";

  const where: Prisma.NoteWhereInput = {
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(tag ? { tags: { some: { name: tag } } } : {}),
  };

  const notes = await prisma.note.findMany({
    where,
    include: noteInclude,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notes);
}

// POST /api/notes: create a note
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { title, content, tags = [] } = parsed.data;

  const note = await prisma.note.create({
    data: {
      title,
      content,
      tags: { connectOrCreate: tagsConnectOrCreate(tags) },
    },
    include: noteInclude,
  });

  return NextResponse.json(note, { status: 201 });
}
