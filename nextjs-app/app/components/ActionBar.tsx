
"use client";

import { motion } from "framer-motion";

interface ActionBarProps {
  mode: string;
  setMode: (mode: string) => void;
  loading: boolean;
  hasInput: boolean;
  onExplain: () => void;
  onLoadExample: () => void;
  onClear: () => void;
}

export default function ActionBar({
  mode,
  setMode,
  loading,
  hasInput,
  onExplain,
  onLoadExample,
  onClear,
}: ActionBarProps) {
  return (
    <div className="flex w-full max-w-2xl items-center justify-between mb-4">
      <div className="flex gap-2">
        <button onClick={onLoadExample} className="text-xs text-white/70 hover:text-white/90 transition">Load Example</button>
        <button onClick={onClear} className="text-xs text-white/70 hover:text-white/90 transition">Clear</button>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border rounded-lg p-2 
                      bg-white/30 dark:bg-gray-800/50 
                      border-gray-500/50 dark:border-gray-700
                      text-gray-900 dark:text-white
                      backdrop-blur-sm transition"
        >
          <option value="beginner">Beginner</option>
          <option value="technical">Technical</option>
        </select>
        <motion.button
          onClick={onExplain}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all 
                     disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center 
                     w-32 h-10"
          disabled={loading || !hasInput}
          whileHover={{ scale: (loading || !hasInput) ? 1 : 1.05 }}
          whileTap={{ scale: (loading || !hasInput) ? 1 : 0.95 }}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Explain"
          )}
        </motion.button>
      </div>
    </div>
  );
}