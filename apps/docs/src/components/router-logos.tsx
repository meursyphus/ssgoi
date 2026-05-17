type Props = { className?: string };

export function NextMark({ className }: Props) {
  return <img src="/logos/nextjs.svg" alt="Next.js" className={className} />;
}

export function SvelteKitMark({ className }: Props) {
  return <img src="/logos/svelte.svg" alt="SvelteKit" className={className} />;
}

export function NuxtMark({ className }: Props) {
  return <img src="/logos/nuxt.svg" alt="Nuxt" className={className} />;
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
