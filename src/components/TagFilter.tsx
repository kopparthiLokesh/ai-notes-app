"use client";

import { useEffect } from "react";
import { useNotesStore } from "@/store/useNotesStore";

export default function TagFilter() {
  const tags = useNotesStore((state) => state.tags);
  const activeTag = useNotesStore((state) => state.activeTag);
  const fetchTags = useNotesStore((state) => state.fetchTags);
  const setActiveTag = useNotesStore((state) => state.setActiveTag);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  if (tags.length === 0) return null;

  const base = "rounded-full px-3 py-1 text-sm border";
  const on = "border-blue-600 bg-blue-600 text-white";
  const off = "border-gray-300 bg-white text-gray-700 hover:bg-gray-100";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setActiveTag(null)}
        className={`${base} ${activeTag === null ? on : off}`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => setActiveTag(activeTag === tag.name ? null : tag.name)}
          className={`${base} ${activeTag === tag.name ? on : off}`}
        >
          #{tag.name}
        </button>
      ))}
    </div>
  );
}
