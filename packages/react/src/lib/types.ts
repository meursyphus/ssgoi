export * from "@ssgoi/core/types";

import type { CSSProperties } from "react";
import type { SsgoiContext } from "@ssgoi/core/types";

/**
 * Navigation info containing from/to paths
 */
export type NavigationInfo = {
  from: string | null;
  to: string;
};

/**
 * React-specific context type with style control
 */
export type ReactSsgoiContext = {
  /** Get transition config for a path */
  getTransition: SsgoiContext;
  /**
   * Get initial style for an element
   * Returns { visibility: "hidden" } on first call if transition is configured, {} otherwise
   * Subsequent calls always return {} to prevent re-hiding on rerender
   */
  getInitialStyle: () => CSSProperties;
};
