import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateNoteSchema } from "@/lib/validations";
import { noteInclude, tagsConnectOrCreate } from "@/lib/notes";

// In recent Next.js versions, params is a Promise, so we await it
type Context = { params: Promise<{ id: string }> };

const notFound = () =>
  NextResponse.json({ error: "Note not found" }, { status: 404 });

// Prisma error code P2025 means "record not found"
function isNotFoundError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

// GET /api/notes/:id
export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  const note = await prisma.note.findUnique({
    where: { id },
    include: noteInclude,
  });
  if (!note) return notFound();
  return NextResponse.json(note);
}

// PATCH /api/notes/:id: update any of title, content, tags
export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { title, content, tags } = parsed.data;

  try {
    const note = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        // If tags were sent: clear the old ones, then attach the new list
        ...(tags && {
          tags: { set: [], connectOrCreate: tagsConnectOrCreate(tags) },
        }),
      },
      include: noteInclude,
    });
    return NextResponse.json(note);
  } catch (error) {
    if (isNotFoundError(error)) return notFound();
    throw error;
  }
}

// DELETE /api/notes/:id
export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) return notFound();
    throw error;
  }
}
