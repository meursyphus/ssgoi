"use client";

import { useState } from "react";

export function NpmPill({ pkg }: { pkg: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(`npm i ${pkg}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-panel px-4 py-2.5 font-mono text-sm text-ink-soft transition-colors hover:border-ink-faint"
      aria-label={`Copy: npm i ${pkg}`}
    >
      <span>
        npm i <span className="text-ink">{pkg}</span>
      </span>
      <span
        className="ml-1 text-ink-faint transition-colors group-hover:text-ink-dim"
        aria-hidden
      >
        {copied ? (
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
            <path
              d="M3 8l3.5 3.5L13 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
            <rect
              x="5"
              y="5"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M3 11V4a1 1 0 0 1 1-1h7"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
