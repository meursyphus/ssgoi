"use client";

import { useState, type ReactNode } from "react";

/**
 * A pill whose whole surface is the copy button. `sm` is the badge form used
 * where the value is reference material; `md` is for a value that is the
 * action on the page.
 */
const SIZES = {
  sm: "gap-1.5 px-3 py-1 text-xs",
  md: "gap-2.5 px-4 py-2.5 text-sm",
} as const;

const ICON_SIZES = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
} as const;

const TONES = {
  default: {
    pill: "border-line-strong bg-panel text-ink-soft hover:border-ink-faint",
    icon: "text-ink-faint group-hover:text-ink-dim",
  },
  brand: {
    pill: "border-brand/40 bg-brand/10 text-brand-soft hover:border-brand/70 hover:bg-brand/15",
    icon: "text-brand/80 group-hover:text-brand-soft",
  },
} as const;

export function CopyPill({
  value,
  label,
  size = "md",
  tone = "default",
  children,
}: {
  /** Written to the clipboard. May be longer than the visible text. */
  value: string;
  /** Announced instead of the visible text, which is often abbreviated. */
  label: string;
  size?: keyof typeof SIZES;
  tone?: keyof typeof TONES;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const icon = ICON_SIZES[size];
  const colors = TONES[tone];

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`group inline-flex items-center rounded-full border font-mono transition-colors ${colors.pill} ${SIZES[size]}`}
      aria-label={label}
      title={label}
    >
      {children}
      <span className={`transition-colors ${colors.icon}`} aria-hidden>
        {copied ? (
          <svg viewBox="0 0 16 16" className={icon} fill="none">
            <path
              d="M3 8l3.5 3.5L13 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className={icon} fill="none">
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
