"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { HostAnimation } from "@ssgoi/core/internal";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { ShowcaseHostBridge } from "./showcase-host-bridge";

const HostContext = createContext<HostAnimation | null>(null);

export function useShowcaseHost(): HostAnimation {
  const ctx = useContext(HostContext);
  if (!ctx) {
    throw new Error(
      "useShowcaseHost must be used inside <DemoShell>. Wrap your demo layout with <DemoShell> and consume the host via <SsgoiWithHost> or useShowcaseHost().",
    );
  }
  return ctx;
}

/**
 * Top-level wrapper for every demo route. Owns the HostAnimation, wires the
 * postMessage iframe bridge, and mounts the floating animation dock — so
 * each demo's chrome (mobile frame, sidebar, gallery, ...) can't accidentally
 * ship without the dock.
 *
 * Inside the shell, render transition-bound content with `<SsgoiWithHost>`.
 */
export function DemoShell({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  return (
    <HostContext.Provider value={host}>
      {children}
      <ShowcaseHostBridge host={host} />
    </HostContext.Provider>
  );
}

/**
 * `<Ssgoi>` that auto-binds to the surrounding `<DemoShell>`'s host. Use this
 * instead of `<Ssgoi>` directly so a demo can't drift onto its own host and
 * detach from the dock.
 */
export function SsgoiWithHost({
  config,
  children,
}: {
  config: SsgoiConfig;
  children: ReactNode;
}) {
  const host = useShowcaseHost();
  return (
    <Ssgoi config={config} host={host}>
      {children}
    </Ssgoi>
  );
}
