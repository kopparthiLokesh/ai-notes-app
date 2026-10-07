import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tasks -> list all tasks (open tasks first, newest first)
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [{ done: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("List tasks error:", error);
    return NextResponse.json(
      { error: "Failed to load tasks." },
      { status: 500 },
    );
  }
}

// POST /api/tasks -> create a task
// Body: { "title": "Call Sara", "noteId": "optional note id" }
export async function POST(request: Request) {
  let title: unknown;
  let noteId: unknown;

  try {
    const body = await request.json();
    title = body.title;
    noteId = body.noteId;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json(
      { error: "Task title is required." },
      { status: 400 },
    );
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: title.trim().slice(0, 200),
        noteId: typeof noteId === "string" && noteId ? noteId : null,
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Failed to create the task." },
      { status: 500 },
    );
  }
}
