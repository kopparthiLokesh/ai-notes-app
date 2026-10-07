import { z } from "zod";

const tagName = z.string().trim().toLowerCase().min(1).max(30);

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().max(20000).default(""),
  tags: z.array(tagName).max(10, "Max 10 tags").default([]),
});

export const updateNoteSchema = createNoteSchema.partial();

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required").max(200),
  noteId: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  done: z.boolean().optional(),
});

export const aiRequestSchema = z.object({
  content: z
    .string()
    .trim()
    .min(20, "Write a bit more before using AI")
    .max(20000),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const suggestTasksSchema = z.object({
  noteId: z.string().min(1, "noteId is required"),
});

export const aiTasksResultSchema = z.object({
  tasks: z.array(z.string().trim().min(1).max(200)).max(10),
});
