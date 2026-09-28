"use client";

import { Suspense, useSyncExternalStore, type ReactNode } from "react";
import { useShowcaseHost } from "@/lib/components/host-context";
import { FloatingAnimationDock } from "@/lib/components/animation-dock";
import { phoneSafeAreaScript } from "@/lib/phone-safe-area";

const subscribeNever = () => () => {};

/**
 * True while rendering on the server and while hydrating that HTML, false on
 * any render that creates DOM on the client.
 */
function useServerMarkup() {
  return useSyncExternalStore(
    subscribeNever,
    () => false,
    () => true,
  );
}

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
  const serverMarkup = useServerMarkup();
  return (
    <>
      {/* Phone mockups declare their home-indicator zone on the iframe; this
          copies it into `--safe-bottom` (lib/phone-safe-area.ts) before the
          demo below is parsed, so a framed demo paints its bars inset from
          the first frame. Every iframe load is a full document load, so the
          script only matters in server HTML. It is dropped once hydrated and
          never rendered on a client navigation into /demo, where React would
          warn that a client-created script never runs. */}
      {serverMarkup && (
        <script dangerouslySetInnerHTML={{ __html: phoneSafeAreaScript }} />
      )}
      {/* Demo route pages read runtime-dynamic data (route `params`,
          `searchParams`) for their interactive content. Under cacheComponents
          that must sit inside a <Suspense> boundary so the static shell can
          prerender without it — one boundary here covers every /demo/* page. */}
      <Suspense>{children}</Suspense>
      <FloatingAnimationDock host={host} />
    </>
  );
}
