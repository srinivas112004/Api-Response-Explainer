"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import JsonEditor from "./components/JsonEditor";
import ActionBar from "./components/ActionBar";
import ResultCard from "./components/ResultCard";

const exampleJson = JSON.stringify(
  {
    
  "userId": 1,
  "id": 101,
  "title": "Learn Next.js with AI",
  "completed": false

  },
  null,
  2
);

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleExplain = async () => {
    if (loading || !jsonInput) return;
    setResult("");
    setLoading(true);

    let parsed;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setResult("⚠️ Invalid JSON format. Please check your input.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: parsed, mode }),
      });

      if (!res.ok || !res.body) {
        const errorData = await res.json();
        setResult(`⚠️ API Error: ${errorData.error || "Unknown error"}`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResult((prev) => prev + decoder.decode(value));
      }
    } catch (error) {
      setResult("⚠️ Failed to contact the backend API.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        handleExplain();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jsonInput, loading, mode]);

  const handleLoadExample = () => setJsonInput(exampleJson);
  const handleClear = () => {
    setJsonInput("");
    setResult("");
  };

  return (
    <motion.main
      
      className={`flex min-h-screen flex-col items-center justify-center p-8 font-sans 
                  ${theme === 'dark' ? 'animated-gradient-dark' : 'animated-gradient-light'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <JsonEditor value={jsonInput} onChange={setJsonInput} theme={theme} />
      <ActionBar
        mode={mode}
        setMode={setMode}
        loading={loading}
        hasInput={!!jsonInput}
        onExplain={handleExplain}
        onLoadExample={handleLoadExample}
        onClear={handleClear}
      />
      <ResultCard result={result} loading={loading} />
    </motion.main>
  );
}