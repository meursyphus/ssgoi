"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { HostAnimation } from "@ssgoi/core/internal";
import { HostContext } from "@/lib/components/host-context";
import { useShowcaseFrameBridge } from "@/lib/hooks";
import { SsgoiTransitionBoundary } from "@/lib/components/ssgoi-transition-boundary";

const config: SsgoiConfig = {
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
 * The catalog/showcase owns one SSGOI root. Demo routes mount their own root
 * with their own config, so active transition contexts never overlap.
 * HostAnimation remains shared for the playback dock and iframe bridge.
 */
export function DocsSsgoiProvider({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  const pathname = usePathname();
  useShowcaseFrameBridge(host);

  const isCatalogRoute =
    pathname === "/" ||
    pathname === "/showcase" ||
    pathname.startsWith("/showcase/");

  return (
    <HostContext.Provider value={host}>
      {isCatalogRoute ? (
        <Ssgoi config={config} host={host}>
          <DocsRouteBoundary>{children}</DocsRouteBoundary>
        </Ssgoi>
      ) : (
        children
      )}
    </HostContext.Provider>
  );
}
