// A tag attached to notes
export type Tag = {
  id: string;
  name: string;
};

// A note, with its tags and an optional AI summary
export type Note = {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
};

// A task, optionally linked to the note it came from
export type Task = {
  id: string;
  title: string;
  done: boolean;
  noteId: string | null;
  createdAt: string;
};
