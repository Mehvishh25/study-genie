"use client";

import { useState } from "react";

export default function WorksheetPage() {
  const [form, setForm] = useState({
    grade: "",
    subject: "",
    topic: "",
    difficulty: "",
    num_questions: 5,
    question_types: "",
    text_input: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateWorksheet = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/worksheet/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          num_questions: Number(form.num_questions),
          question_types: form.question_types
            .split(",")
            .map((q) => q.trim()),
        }),
      });

      const data = await res.json();
      setResult(data.output);
    } catch (err) {
      setResult("Error generating worksheet");
    }

    setLoading(false);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Worksheet Generator</h1>

      <div className="space-y-3">

        <input
          name="grade"
          placeholder="Grade"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          name="subject"
          placeholder="Subject"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          name="topic"
          placeholder="Topic"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          name="difficulty"
          placeholder="Difficulty (Easy / Medium / Hard)"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          name="num_questions"
          type="number"
          placeholder="Number of Questions"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          name="question_types"
          placeholder="Question Types (MCQ, Short Answer, etc)"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <textarea
          name="text_input"
          placeholder="Reference Text (Optional)"
          className="border p-2 w-full"
          rows={4}
          onChange={handleChange}
        />

        <button
          onClick={generateWorksheet}
          className="border px-6 py-2 mt-2"
        >
          {loading ? "Generating..." : "Generate Worksheet"}
        </button>
      </div>

      {result && (
        <div className="mt-8 p-4 border whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
