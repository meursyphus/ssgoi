"use client";

import { Suspense, type ReactNode } from "react";
import { useShowcaseHost } from "@/lib/components/host-context";
import { FloatingAnimationDock } from "@/lib/components/animation-dock";

/**
 * Demo route group layout. Mounts the floating playback dock once for every
 * `/demo/*` route. The dock reads the shared `HostAnimation` from
 * `HostContext` (provided at the top by `DocsSsgoiProvider`), so a single
 * dock controls whatever transition is currently running anywhere under
 * `/demo`. Inside an iframe the dock self-hides — `FloatingAnimationDock`
 * already handles that — so the parent showcase shell stays in charge.
 */
export default function DemoLayout({ children }: { children: ReactNode }) {
  const host = useShowcaseHost();
  return (
    <>
      {/* Demo route pages read runtime-dynamic data (route `params`,
          `searchParams`) for their interactive content. Under cacheComponents
          that must sit inside a <Suspense> boundary so the static shell can
          prerender without it — one boundary here covers every /demo/* page. */}
      <Suspense>{children}</Suspense>
      <FloatingAnimationDock host={host} />
    </>
  );
}
