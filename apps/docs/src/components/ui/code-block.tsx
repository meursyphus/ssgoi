"use client";

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";

// Register languages
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("tsx", typescript);
hljs.registerLanguage("jsx", javascript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  className = "",
}: CodeBlockProps) {
  const highlightedCode = useMemo(() => {
    try {
      return hljs.highlight(code, { language }).value;
    } catch {
      return code;
    }
  }, [code, language]);

  return (
    <div
      className={`bg-[#111] border border-white/5 rounded-lg overflow-hidden ${className}`}
    >
      {filename && (
        <div className="px-4 py-2 border-b border-white/5">
          <span className="text-[10px] text-neutral-500">{filename}</span>
        </div>
      )}
      <pre className="hljs p-4 overflow-x-auto !bg-transparent">
        <code
          className={`language-${language} text-xs font-mono leading-relaxed`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}
