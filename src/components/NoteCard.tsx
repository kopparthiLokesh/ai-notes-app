"use client";

import { useState } from "react";
import type { Note } from "@/types";
import { useNotesStore } from "@/store/useNotesStore";
import { parseTags } from "@/lib/parseTags";
import SummarizeButton from "@/components/SummarizeButton";

export default function NoteCard({ note }: { note: Note }) {
  const updateNote = useNotesStore((state) => state.updateNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const tagNames = note.tags.map((tag) => tag.name).join(", ");

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagsInput, setTagsInput] = useState(tagNames);

  // State for the AI tag suggestion
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState("");

  async function handleSuggestTags() {
    setSuggesting(true);
    setSuggestError("");

    try {
      const res = await fetch("/api/ai/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      // Combine the tags you already typed with the AI's tags (no duplicates)
      const existing = parseTags(tagsInput);
      const merged = [...new Set([...existing, ...(data.tags as string[])])];
      setTagsInput(merged.join(", "));
    } catch (err) {
      setSuggestError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSuggesting(false);
    }
  }

  async function handleSave() {
    await updateNote(note.id, {
      title,
      content,
      tags: parseTags(tagsInput),
    });
    setEditing(false);
  }

  function handleCancel() {
    setTitle(note.title);
    setContent(note.content);
    setTagsInput(tagNames);
    setSuggestError("");
    setEditing(false);
  }

  // ---------- EDIT MODE ----------
  if (editing) {
    return (
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border p-2"
          placeholder="Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-2 w-full rounded border p-2"
          rows={4}
          placeholder="Write your note..."
        />
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="mt-2 w-full rounded border p-2"
          placeholder="Tags, separated by commas"
        />

        <button
          onClick={handleSuggestTags}
          disabled={suggesting}
          className="mt-2 rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {suggesting ? "Thinking..." : "🏷️ Suggest tags"}
        </button>

        {suggestError && (
          <p className="mt-2 text-sm text-red-600">{suggestError}</p>
        )}

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ---------- NORMAL MODE ----------
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{note.title}</h2>
      <p className="mt-1 whitespace-pre-wrap text-gray-700">{note.content}</p>

      {note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <SummarizeButton content={note.content} />

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
        >
          Edit
        </button>
        <button
          onClick={() => deleteNote(note.id)}
          className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
