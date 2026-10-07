import { NextResponse } from "next/server";
import { streamText } from "@/lib/llm";

export async function POST(request: Request) {
  // 1. Check the input (same as before)
  let content: unknown;
  try {
    const body = await request.json();
    content = body.content;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof content !== "string" || content.trim().length < 20) {
    return NextResponse.json(
      { error: "Note content must be at least 20 characters." },
      { status: 400 },
    );
  }

  const trimmed = content.slice(0, 8000);

  // 2. Build a stream that sends each piece to the browser right away
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const pieces = streamText({
          system:
            "You summarize personal notes. Write a clear summary in 1-3 sentences. " +
            "Do not add information that is not in the note. " +
            "Reply with the summary only, no preamble.",
          prompt: trimmed,
          maxTokens: 300,
        });

        for await (const piece of pieces) {
          controller.enqueue(encoder.encode(piece));
        }
        controller.close();
      } catch (error) {
        console.error("Summarize stream error:", error);
        controller.error(error);
      }
    },
  });

  // 3. Send the stream back as plain text
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
