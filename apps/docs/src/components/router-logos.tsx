type Props = { className?: string };

const wrap = "h-6 w-6";

export function NextMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="currentColor"
      className={`${wrap} ${className ?? ""}`}
      aria-hidden
    >
      <circle cx="90" cy="90" r="90" fill="currentColor" />
      <path
        d="M149.5 157.5L62 45H45v90h13.5V61.5L139 165a90 90 0 0 0 10.5-7.5ZM115 45h13.5v68L115 96V45Z"
        fill="#fff"
      />
    </svg>
  );
}

export function SvelteKitMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 98 118"
      fill="currentColor"
      className={`${wrap} ${className ?? ""}`}
      aria-hidden
    >
      <path d="M92 16C81 0 59-5 44 5L16 23C9 27 4 35 2 44c-1 7 0 15 3 21-2 4-4 8-4 12-2 9 0 18 5 25 11 16 33 21 48 11l28-18c7-4 12-12 14-21 1-7 0-15-3-21 2-4 4-8 5-12 1-9 0-18-6-25Z" />
    </svg>
  );
}

export function NuxtMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${wrap} ${className ?? ""}`}
      aria-hidden
    >
      <path d="M13.4 3.5a2 2 0 0 0-3.4 0L1.3 18.2a2 2 0 0 0 1.7 3h6.2a4 4 0 0 1-.4-1.8c0-.6.2-1.2.5-1.8L15.6 7l-2.2-3.5Zm9.4 14.7-6-10.3a2 2 0 0 0-3.5 0L7.4 18.2a2 2 0 0 0 1.7 3h11.9a2 2 0 0 0 1.8-3Z" />
    </svg>
  );
}
