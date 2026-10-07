import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateText } from "@/lib/llm";
import { suggestTasksSchema, aiTasksResultSchema } from "@/lib/validations";

const SYSTEM = `You extract actionable to-do items from notes.
Respond with ONLY valid JSON in this exact shape, no other text:
{"tasks": ["short task 1", "short task 2"]}
Each task must start with a verb and be under 100 characters.
If the note has no actionable items, return {"tasks": []}.`;

export async function POST(req: Request) {
  const parsed = suggestTasksSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "noteId is required" }, { status: 400 });
  }

  const note = await prisma.note.findUnique({
    where: { id: parsed.data.noteId },
  });
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  try {
    const raw = await generateText({
      system: SYSTEM,
      prompt: `Title: ${note.title}\n\nContent:\n${note.content}`,
    });

    // LLMs sometimes wrap JSON in ```json fences, so strip them
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = aiTasksResultSchema.parse(JSON.parse(cleaned));

    return NextResponse.json(result);
  } catch (err) {
    console.error("AI task extraction failed:", err);
    return NextResponse.json(
      { error: "Could not extract tasks. Try again." },
      { status: 502 },
    );
  }
}
