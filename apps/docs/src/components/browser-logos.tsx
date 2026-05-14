type Props = { className?: string };

export function ChromeMark({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        d="M5 14a24 24 0 0 1 38.4-2.8L29 14.5a10 10 0 0 0-15 4.8L5 14Z"
        fill="#EA4335"
      />
      <path
        d="M43.4 11.2A24 24 0 0 1 45.7 33L31 30a10 10 0 0 0-2-15.5l14.4-3.3Z"
        fill="#FBBC04"
      />
      <path
        d="M45.7 33A24 24 0 0 1 5 14l9 5.3a10 10 0 0 0 17 10.7l14.7 3Z"
        fill="#34A853"
      />
      <circle cx="24" cy="24" r="9" fill="#fff" />
      <circle cx="24" cy="24" r="7" fill="#1A73E8" />
    </svg>
  );
}

export function SafariMark({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="safari-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1FB5E9" />
          <stop offset="100%" stopColor="#0066D6" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#safari-g)" />
      <circle cx="24" cy="24" r="18" fill="#fff" />
      <path d="M24 8l-4 14 14-4-10-10z" fill="#E0E0E0" />
      <path d="M24 8l4 14-14-4 10-10z" fill="#E64C3C" />
      <path
        d="M24 40l4-14-14 4 10 10z"
        fill="#fff"
        stroke="#bbb"
        strokeWidth="0.5"
      />
      <path
        d="M24 40l-4-14 14 4-10 10z"
        fill="#fff"
        stroke="#bbb"
        strokeWidth="0.5"
      />
      <circle cx="24" cy="24" r="1.6" fill="#444" />
    </svg>
  );
}

export function FirefoxMark({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <radialGradient id="ff-g" cx="60%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#FFCB0E" />
          <stop offset="40%" stopColor="#F47C20" />
          <stop offset="100%" stopColor="#E0341B" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="#0A4DAA" />
      <path
        d="M9 16c3-7 9-12 17-12 11 0 19 9 19 20 0 11-9 20-20 20-7 0-13-3-17-9 4 4 11 5 16 1 8-5 8-15 3-21-3-3-7-4-10-3-4 1-7 4-8 9-1 4 1 8 4 10-3-1-5-4-6-7-1-3 0-6 2-8Z"
        fill="url(#ff-g)"
      />
    </svg>
  );
}

export function EdgeMark({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="edge-1" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0078D4" />
          <stop offset="100%" stopColor="#26ADE2" />
        </linearGradient>
        <linearGradient id="edge-2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3DD9EB" />
          <stop offset="100%" stopColor="#0078D4" />
        </linearGradient>
      </defs>
      <path
        d="M9 32c3 9 12 14 21 12 6-1 11-5 13-10-5 3-12 2-15-3-3-4-2-9 2-13 4-3 11-3 16 1-2-9-11-15-21-13C13 7 4 18 6 28c1 2 2 3 3 4Z"
        fill="url(#edge-1)"
      />
      <path
        d="M8 30c3 7 10 11 18 9 6-1 11-6 11-13 0-4-3-7-7-7-5 0-9 4-9 9 0 4 4 7 8 7 1 0 2 0 3-1-3 5-9 7-15 5-4-2-7-5-9-9Z"
        fill="url(#edge-2)"
      />
    </svg>
  );
}
