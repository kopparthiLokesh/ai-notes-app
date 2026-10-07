"use client";

import { useState } from "react";
import { useNotesStore } from "@/store/useNotesStore";
import { parseTags } from "@/lib/parseTags";

export default function NoteForm() {
  const addNote = useNotesStore((state) => state.addNote);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // stop the browser from reloading the page
    setSaving(true);

    const ok = await addNote({ title, content, tags: parseTags(tagsText) });

    setSaving(false);
    if (ok) {
      // Clear the form only if saving worked
      setTitle("");
      setContent("");
      setTagsText("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-gray-300 bg-white p-4 text-gray-900 shadow-sm"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded border border-gray-300 p-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
        rows={4}
        className="w-full rounded border border-gray-300 p-2"
      />
      <input
        value={tagsText}
        onChange={(e) => setTagsText(e.target.value)}
        placeholder="Tags, separated by commas (e.g. work, ideas)"
        className="w-full rounded border border-gray-300 p-2"
      />
      <button
        type="submit"
        disabled={saving || !title.trim()}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Add note"}
      </button>
    </form>
  );
}
