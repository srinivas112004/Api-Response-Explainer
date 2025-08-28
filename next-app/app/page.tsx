"use client";

import { useState } from "react";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("beginner");

  const handleExplain = async () => {
    try {
      let parsed;
      try {
        parsed = JSON.parse(jsonInput);
      } catch {
        parsed = jsonInput; // fallback as raw text
      }

      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: parsed, mode }),
      });

      const data = await res.json();
      setResult(data.explanation || data.error || "⚠️ Something went wrong");
    } catch {
      setResult("⚠️ Failed to contact API.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">🧮 API Response Explainer</h1>

      <textarea
        className="w-full max-w-xl p-4 rounded-lg border border-gray-300 mb-4"
        rows={8}
        placeholder='Paste your JSON here... (e.g. {"id":1,"name":"Alice"})'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />

      <div className="flex gap-4 mb-4">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="beginner">Beginner (Non-Tech )</option>
          <option value="technical">Technical</option>
        </select>

        <button
          onClick={handleExplain}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Explain
        </button>
      </div>

      {result && (
        <div className="mt-6 w-full max-w-xl bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Explanation:</h2>
          <p className="whitespace-pre-line">{result}</p>
        </div>
      )}
    </main>
  );
}
