"use client";

import { useEffect } from "react";
import { useNotesStore } from "@/store/useNotesStore";
import NoteCard from "./NoteCard";

export default function NoteList() {
  const notes = useNotesStore((state) => state.notes);
  const loading = useNotesStore((state) => state.loading);
  const error = useNotesStore((state) => state.error);
  const query = useNotesStore((state) => state.query);
  const activeTag = useNotesStore((state) => state.activeTag);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);

  // Runs once when the page first loads
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filtering = query.trim() !== "" || activeTag !== null;

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded bg-red-100 p-3 text-sm text-red-700">{error}</p>
      )}

      {loading && notes.length === 0 && (
        <p className="text-gray-500">Loading notes...</p>
      )}

      {!loading && notes.length === 0 && !error && (
        <p className="text-gray-500">
          {filtering
            ? "No notes match your search."
            : "No notes yet. Create your first one above!"}
        </p>
      )}

      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
