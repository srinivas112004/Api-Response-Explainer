
"use client";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <div className="flex w-full max-w-2xl justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-white">
        🧮 API Response Explainer
      </h1>
      <ThemeToggle />
    </div>
  );
}