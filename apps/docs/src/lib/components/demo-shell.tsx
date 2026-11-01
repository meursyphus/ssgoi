"use client";

import { type ReactNode } from "react";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
  type SsgoiConfig,
  type SsgoiFramework,
} from "@ssgoi/react";
import { useShowcaseHost } from "./host-context";

// Re-export so existing imports (`from "@/lib/components/demo-shell"`) keep
// working after the host moved up to `DocsSsgoiProvider`.
export { useShowcaseHost } from "./host-context";

const framework: SsgoiFramework = {
  useRoute: ({ parallelRoutesKey = "children" }) => {
    const pathname = usePathname();
    const selectedSegments = useSelectedLayoutSegments(parallelRoutesKey) ?? [];
    return pathname == null ? null : { pathname, selectedSegments };
  },
};

/**
 * Per-demo top wrapper. Now a thin passthrough: the `HostAnimation`, the
 * iframe postMessage bridge, and the playback dock all moved up — host +
 * bridge live on `DocsSsgoiProvider` (root), dock lives on
 * `app/demo/layout.tsx`. DemoShell stays only to give per-demo layouts a
 * stable mount point (e.g. for future demo-specific providers) and to keep
 * existing call sites importing `<DemoShell>` working without a refactor.
 */
export function DemoShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * `<Ssgoi>` that auto-binds to the surrounding `HostContext`'s host. Use this
 * instead of `<Ssgoi>` directly so a demo can't drift onto its own host and
 * detach from the playback dock.
 */
export function SsgoiWithHost({
  config,
  children,
  boundaryClassName = "h-full min-h-full bg-black",
  withTransitionBoundary = true,
}: {
  config: SsgoiConfig;
  children: ReactNode;
  boundaryClassName?: string;
  withTransitionBoundary?: boolean;
}) {
  const host = useShowcaseHost();
  const content = withTransitionBoundary ? (
    <SsgoiLayoutBoundary className={boundaryClassName}>
      {children}
    </SsgoiLayoutBoundary>
  ) : (
    children
  );

  return (
    <Ssgoi config={config} host={host} framework={framework}>
      {content}
    </Ssgoi>
  );
}
