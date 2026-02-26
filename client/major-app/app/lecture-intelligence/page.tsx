"use client";

import { useState } from "react";

export default function LectureIntelligencePage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an MP3 file first.");
      return;
    }

    setLoading(true);
    setTranscript("");
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/lecture/summarize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setTranscript(data.transcript || "");
      setSummary(data.summary || "");

    } catch (err) {
      console.error(err);
      alert("Error uploading file. Make sure Flask server is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Lecture Intelligence</h1>

      <div className="flex items-center space-x-4 mb-4">
        <input
          type="file"
          accept=".mp3"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload & Summarize"}
        </button>
      </div>

      {transcript && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Transcript</h2>
          <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap">{transcript}</div>
        </div>
      )}

      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <div className="p-4 bg-green-100 rounded whitespace-pre-wrap">{summary}</div>
        </div>
      )}
    </div>
  );
}