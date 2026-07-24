"use client";

import { createContext, useContext } from "react";
import type { HostAnimation } from "@ssgoi/core/internal";

/**
 * Shared HostAnimation context.
 *
 * Provided once at the top by `DocsSsgoiProvider`. The active catalog or demo
 * SSGOI root consumes the same host as the playback dock. Keeping the context
 * here lets consumers reach it without importing `DemoShell`.
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
