"use client";

import type { HostAnimation } from "@ssgoi/core/internal";
import { useShowcaseFrameBridge } from "@/lib/hooks";
import { FloatingAnimationDock } from "./animation-dock";

/**
 * One-stop wiring for a `HostAnimation`: postMessage bridge (for iframe
 * embedding) + the floating animation dock. Mount this once near the
 * `<Ssgoi host=...>` so new demos can't ship without the dock.
 */
export function ShowcaseHostBridge({
  host,
  dock = true,
  dockPosition,
}: {
  host: HostAnimation;
  /** Suppress the floating dock (e.g. when caller renders its own). */
  dock?: boolean;
  /** Override Tailwind position classes for the dock. */
  dockPosition?: string;
}) {
  useShowcaseFrameBridge(host);
  if (!dock) return null;
  return <FloatingAnimationDock host={host} position={dockPosition} />;
}
