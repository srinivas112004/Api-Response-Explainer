
"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CopyButton from "./CopyButton";

interface ResultCardProps {
  result: string;
  loading: boolean;
}

export default function ResultCard({ result, loading }: ResultCardProps) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className="mt-6 w-full max-w-2xl p-6 rounded-lg shadow-xl relative
                     bg-white/30 dark:bg-gray-800/50 
                     border-gray-500/50 dark:border-gray-700
                     backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <CopyButton textToCopy={result} />
          <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Explanation:</h2>
          <div className="prose prose-sm md:prose-base prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result}
            </ReactMarkdown>
            {loading && <span className="blinking-cursor"></span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}