"use client";

import { useState } from "react";

export default function SummarizeButton({ content }: { content: string }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSummarize() {
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      // Input errors (like "too short") still come back as JSON
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      if (!res.body) throw new Error("No response from the server");

      // Read the answer piece by piece as it arrives
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setSummary((previous) => previous + text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? "Summarizing..." : "✨ Summarize"}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {summary && (
        <p className="mt-2 rounded bg-purple-50 p-2 text-sm text-gray-800">
          {summary}
        </p>
      )}
    </div>
  );
}
