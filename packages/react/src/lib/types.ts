export * from "@ssgoi/core/types";

import type { CSSProperties } from "react";
import type { SsgoiContext } from "@ssgoi/core/types";

/**
 * React-specific context type with style control
 */
export type ReactSsgoiContext = {
  /** Get transition config for a path */
  getTransition: SsgoiContext;
  /**
   * Get initial style for an element
   * Returns { visibility: "hidden" } if transition is configured, {} otherwise
   */
  getInitialStyle: (path: string) => CSSProperties;
};
