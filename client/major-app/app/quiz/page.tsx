"use client";

import { useState } from "react";

export default function QuizPage() {
  const [form, setForm] = useState({
    grade: "",
    subject: "",
    topic: "",
    difficulty: "Easy",
    num_questions: 5,
    text_input: ""
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const generateQuiz = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      setResult({ error: "Something went wrong" });
    }

    setLoading(false);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Quiz Generator</h1>

      <div className="grid grid-cols-2 gap-4">

        <input name="grade" placeholder="Grade"
          className="border p-2"
          onChange={handleChange} />

        <input name="subject" placeholder="Subject"
          className="border p-2"
          onChange={handleChange} />

        <input name="topic" placeholder="Topic"
          className="border p-2"
          onChange={handleChange} />

        <select name="difficulty"
          className="border p-2"
          onChange={handleChange}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <input name="num_questions" type="number"
          className="border p-2"
          onChange={handleChange} />

      </div>

      <textarea
        name="text_input"
        placeholder="Optional reference text..."
        className="border p-3 w-full mt-4"
        rows={4}
        onChange={handleChange}
      />

      <button
        onClick={generateQuiz}
        className="border px-6 py-2 mt-4"
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {result && (
        <div className="mt-8 space-y-6">
          {Array.isArray(result) ? (
            result.map((q: any, index: number) => (
              <div key={index} className="border p-4">
                <p className="font-semibold">
                  {index + 1}. {q.question}
                </p>

                {Object.entries(q.options).map(([key, value]: any) => (
                  <p key={key}>
                    {key}. {value}
                  </p>
                ))}

                <p className="mt-2 text-green-600">
                  Answer: {q.answer}
                </p>
              </div>
            ))
          ) : (
            <div className="text-red-500">
              {result.error || "Invalid response format"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
