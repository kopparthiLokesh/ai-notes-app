import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Throw this anywhere in a route to send a clean error to the browser
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// Turns any error into a safe JSON response
export function handleError(err: unknown) {
  // 1. Bad input (Zod validation failed)
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Invalid input",
        details: err.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  // 2. Errors we threw on purpose, e.g. new ApiError(404, "Note not found")
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  // 3. Prisma database errors carry a "code"
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: string }).code;
    if (code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (code === "P2002") {
      return NextResponse.json({ error: "Already exists" }, { status: 409 });
    }
  }

  // 4. Anything else: log details on the server, send a safe message
  console.error(err);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}
