import { create } from "zustand";
import type { Note, Tag } from "@/types";

type NoteInput = {
  title: string;
  content: string;
  tags: string[];
};

type NotesState = {
  notes: Note[];
  tags: Tag[];
  query: string;
  activeTag: string | null;
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  fetchTags: () => Promise<void>;
  setQuery: (query: string) => void;
  setActiveTag: (tag: string | null) => void;
  addNote: (input: NoteInput) => Promise<boolean>;
  updateNote: (id: string, input: Partial<NoteInput>) => Promise<boolean>;
  deleteNote: (id: string) => Promise<void>;
};

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  tags: [],
  query: "",
  activeTag: null,
  loading: false,
  error: null,

  // Load notes, using the current search text and selected tag
  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const { query, activeTag } = get();
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (activeTag) params.set("tag", activeTag);

      const res = await fetch(`/api/notes?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load notes");
      const notes: Note[] = await res.json();
      set({ notes, loading: false });
    } catch (error) {
      set({ error: getMessage(error), loading: false });
    }
  },

  // Load the list of tags for the filter buttons
  fetchTags: async () => {
    try {
      const res = await fetch("/api/tags");
      if (!res.ok) return;
      const tags: Tag[] = await res.json();
      set({ tags });
    } catch {
      // Tag buttons are optional, so we ignore errors here
    }
  },

  // Changing the search text or tag reloads the notes
  setQuery: (query) => {
    if (query === get().query) return;
    set({ query });
    get().fetchNotes();
  },

  setActiveTag: (tag) => {
    set({ activeTag: tag });
    get().fetchNotes();
  },

  // After any change we reload, so filters and tag buttons stay correct
  addNote: async (input) => {
    set({ error: null });
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Could not create the note");
      await get().fetchNotes();
      get().fetchTags();
      return true;
    } catch (error) {
      set({ error: getMessage(error) });
      return false;
    }
  },

  updateNote: async (id, input) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Could not update the note");
      await get().fetchNotes();
      get().fetchTags();
      return true;
    } catch (error) {
      set({ error: getMessage(error) });
      return false;
    }
  },

  deleteNote: async (id) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete the note");
      set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
      get().fetchTags();
    } catch (error) {
      set({ error: getMessage(error) });
    }
  },
}));
