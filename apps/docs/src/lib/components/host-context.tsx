"use client";

import { createContext, useContext } from "react";
import type { HostAnimation } from "@ssgoi/core/internal";

/**
 * Shared HostAnimation context.
 *
 * Provided once at the top by `DocsSsgoiProvider`. Demos consume the same host
 * via `useShowcaseHost()` so the playback dock at `app/demo/layout.tsx` and
 * every nested `<Ssgoi host={...}>` share one controller. Keeping the context
 * here (instead of inside `demo-shell.tsx`) lets consumers reach the host
 * without dragging `DemoShell` into their import graph.
 */
export const HostContext = createContext<HostAnimation | null>(null);

export function useShowcaseHost(): HostAnimation {
  const ctx = useContext(HostContext);
  if (!ctx) {
    throw new Error(
      "useShowcaseHost must be used below <DocsSsgoiProvider> (or any HostContext.Provider).",
    );
  }
  return ctx;
}
