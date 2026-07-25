type Props = { className?: string };

export function NextMark({ className }: Props) {
  return <img src="/logos/nextjs.svg" alt="Next.js" className={className} />;
}

export function SvelteKitMark({ className }: Props) {
  return <img src="/logos/svelte.svg" alt="SvelteKit" className={className} />;
}

export function SolidStartMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="SolidStart"
      className={className}
    >
      <rect width="24" height="24" rx="6" fill="#2C4F7C" />
      <path d="M5.1 14.35 12 18.3l6.9-3.95L12 10.4 5.1 14.35Z" fill="#76B3E1" />
      <path d="M5.1 9.65 12 13.6l6.9-3.95L12 5.7 5.1 9.65Z" fill="#518AC8" />
      <path d="M12 13.6v4.7l6.9-3.95v-4.7L12 13.6Z" fill="#99D7FF" />
      <path d="M5.1 9.65v4.7L12 18.3v-4.7L5.1 9.65Z" fill="#76B3E1" />
    </svg>
  );
}

export function NuxtMark({ className }: Props) {
  return <img src="/logos/nuxt.svg" alt="Nuxt" className={className} />;
}

export function QwikMark({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label="Qwik" className={className}>
      <circle cx="12" cy="12" r="12" fill="#AC7EF4" />
      <path
        d="M12.35 5.25c3.44 0 5.95 2.46 5.95 5.86 0 2.08-.9 3.84-2.38 4.89l1.59 1.77-2.16 1.93-1.84-2.1c-.37.07-.76.1-1.16.1-3.44 0-5.95-2.46-5.95-5.87 0-3.4 2.51-5.86 5.95-5.86Zm0 2.56c-1.84 0-3.04 1.32-3.04 3.3 0 1.99 1.2 3.31 3.04 3.31.27 0 .52-.03.76-.08l-1.35-1.52 2.14-1.92 1.11 1.27c.26-.58.39-1.28.39-2.06 0-1.98-1.2-3.3-3.05-3.3Z"
        fill="#0E0B14"
      />
    </svg>
  );
}

export function ReactRouterMark({ className }: Props) {
  return (
    <img
      src="/logos/react-router.svg"
      alt="React Router"
      className={className}
    />
  );
}

export function TanStackRouterMark({ className }: Props) {
  return (
    <img
      src="/logos/tanstack.svg"
      alt="TanStack Router"
      className={className}
    />
  );
}

export function AngularMark({ className }: Props) {
  return <img src="/logos/angular.svg" alt="Angular" className={className} />;
}
