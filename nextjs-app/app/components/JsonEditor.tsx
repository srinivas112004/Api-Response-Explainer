
"use client";

import CodeEditor from "@uiw/react-textarea-code-editor";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: "light" | "dark";
}

export default function JsonEditor({ value, onChange, theme }: JsonEditorProps) {
  return (
    <div
      className="w-full max-w-2xl rounded-lg border mb-4 
                 bg-white/20 dark:bg-gray-900/50 
                 border-gray-500/50 dark:border-gray-700
                 backdrop-blur-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all"
      data-color-mode={theme}
    >
      <CodeEditor
        value={value}
        language="json"
        onChange={(e) => onChange(e.target.value)}
        padding={16}
        placeholder="Paste your JSON here...eg { }"
        style={{
          fontSize: 14,
          fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
          background: 'transparent',
          minHeight: '200px',
        }}
      />
    </div>
  );
}