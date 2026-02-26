"use client";

import { useState, useRef } from "react";

export default function RagPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ============================
  // Auto Upload Multiple PDFs
  // ============================
  const uploadFiles = async (selectedFiles: FileList) => {
    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/rag/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert("PDF(s) uploaded successfully ✅");
      }
    } catch {
      alert("Upload failed ❌");
    }

    setLoading(false);
  };

  // ============================
  // Ask Question
  // ============================
  const askQuestion = async () => {
    if (!question) return alert("Enter question");

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/rag/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong" });
    }

    setLoading(false);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        📄 Multi-PDF RAG Assistant
      </h1>

      {/* Upload */}
      <div className="border p-4 rounded-lg">
        <h2 className="mb-3 font-semibold">Select PDF(s)</h2>

        <input
          type="file"
          accept="application/pdf"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files) {
              uploadFiles(e.target.files);
            }
          }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="border px-4 py-2 rounded"
        >
          Choose PDF(s)
        </button>
      </div>

      {/* Ask */}
      <div className="mt-8">
        <textarea
          placeholder="Ask a question from uploaded PDFs..."
          className="border p-3 w-full rounded"
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={askQuestion}
          className="border px-6 py-2 mt-4 rounded"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-8 space-y-6">

          {result.answer && (
            <div className="border p-4 rounded">
              <h2 className="font-bold mb-2">🧠 Answer:</h2>
              <p>{result.answer}</p>
            </div>
          )}

          {result.sources && (
            <div>
              <h2 className="font-bold mb-2">📚 Sources:</h2>

              {result.sources.map((src: any, i: number) => (
                <div key={i} className="border p-3 mt-2 text-sm rounded">
                  <p><strong>File:</strong> {src.file}</p>
                  <p><strong>Page:</strong> {src.page}</p>
                  <p><strong>Snippet:</strong> {src.snippet}...</p>
                </div>
              ))}
            </div>
          )}

          {result.error && (
            <div className="text-red-500">
              {result.error}
            </div>
          )}

        </div>
      )}
    </div>
  );
}