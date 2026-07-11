"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { HostAnimation } from "@ssgoi/core/internal";
import { HostContext } from "@/lib/components/host-context";
import { useShowcaseFrameBridge } from "@/lib/hooks";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";

const config: SsgoiConfig = {
  preserveScroll: false,
  transitions: [],
};

function DocsRouteBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isShowcaseRoute =
    pathname === "/" ||
    pathname === "/showcase" ||
    pathname.startsWith("/showcase/");

  if (!isShowcaseRoute) return <>{children}</>;

  return (
    <SsgoiTransitionBoundary className="min-h-dvh bg-black">
      {children}
    </SsgoiTransitionBoundary>
  );
}

/**
 * Top-level provider:
 *   - Creates the one and only `HostAnimation` and exposes it via `HostContext`,
 *     so the playback dock (mounted at `app/demo/layout.tsx`) and every nested
 *     `<Ssgoi host={...}>` share one controller.
 *   - Wraps the home catalog + `/showcase/[slug]` demo pages in their own
 *     `<Ssgoi>` for the non-directional scroll transition between `/` and
 *     `/showcase`.
 *   - Mounts the postMessage bridge once at the root so docs-as-showcase
 *     (`slug: ssgoi-docs`) and every `/demo/*` route loaded inside an iframe
 *     can talk to their parent showcase shell without per-demo wiring.
 *
 * The floating playback dock is *not* mounted here — it lives at
 * `app/demo/layout.tsx` so it only appears under `/demo/*`.
 */
export function DocsSsgoiProvider({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  useShowcaseFrameBridge(host);

  return (
    <HostContext.Provider value={host}>
      <Ssgoi config={config} host={host}>
        <DocsRouteBoundary>{children}</DocsRouteBoundary>
      </Ssgoi>
    </HostContext.Provider>
  );
}
