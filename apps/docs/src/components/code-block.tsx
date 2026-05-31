import hljs from "highlight.js";

const LANG_ALIAS: Record<string, string> = {
  tsx: "typescript",
  ts: "typescript",
  jsx: "javascript",
  js: "javascript",
  sh: "bash",
};

export function CodeBlock({
  code,
  language = "tsx",
  className = "",
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const lang = LANG_ALIAS[language] ?? language;
  const resolved = hljs.getLanguage(lang) ? lang : "plaintext";
  const html = hljs.highlight(code, { language: resolved }).value;

  return (
    <pre
      className={`overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 font-mono text-[13px] leading-relaxed text-neutral-200 ${className}`}
    >
      <code
        className="hljs bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
