"use client";

import { useEffect, useState } from "react";
import { useNotesStore } from "@/store/useNotesStore";

export default function SearchBar() {
  const setQuery = useNotesStore((state) => state.setQuery);
  const [text, setText] = useState("");

  // Wait 300ms after the last keystroke before searching,
  // so we don't call the API on every single letter
  useEffect(() => {
    const timer = setTimeout(() => setQuery(text), 300);
    return () => clearTimeout(timer);
  }, [text, setQuery]);

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search notes..."
      className="w-full rounded border border-gray-300 bg-white p-2 text-gray-900"
    />
  );
}
