import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations";
import { handleError } from "@/lib/api-error";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  try {
    const data = createTaskSchema.parse(await req.json());
    const task = await prisma.task.create({ data });
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
