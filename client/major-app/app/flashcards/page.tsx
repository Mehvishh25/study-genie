"use client";

import { useState } from "react";

export default function FlashcardsPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateFlashcards = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/flashcards/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Something went wrong" });
    }

    setLoading(false);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Flashcard Generator
      </h1>

      <textarea
        placeholder="Paste lecture notes here..."
        className="border p-3 w-full"
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={generateFlashcards}
        className="border px-6 py-2 mt-4"
      >
        {loading ? "Generating..." : "Generate Flashcards"}
      </button>

      {result && (
        <div className="mt-8 space-y-4">
          {Array.isArray(result) ? (
            result.map((card: any, index: number) => (
              <div key={index} className="border p-4">
                <p><strong>Q:</strong> {card.Question}</p>
                <p className="mt-2"><strong>A:</strong> {card.Answer}</p>
              </div>
            ))
          ) : (
            <div className="border p-4 text-red-500">
              {result.error || "Invalid response format"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
