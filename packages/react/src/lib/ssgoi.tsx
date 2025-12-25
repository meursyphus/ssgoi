"use client";
import React, { useMemo } from "react";
import type { ReactNode, CSSProperties } from "react";
import type { SsgoiConfig, ReactSsgoiContext, NavigationInfo } from "./types";
import { SsgoiProvider } from "./context";
import {
  createSggoiTransitionContext,
  createAnyOrderDetector,
} from "@ssgoi/core";
import type { NavigationDetector, NavigationPair } from "@ssgoi/core";

interface SsgoiProps {
  config: SsgoiConfig;
  children: ReactNode;
  /**
   * Function to get current navigation info (from/to paths)
   * Used to determine initial style and navigation detection
   * @example
   * const pathname = usePathname();
   * const prevPathname = usePrevious(pathname);
   * const navRef = useRef({ from: prevPathname, to: pathname });
   * navRef.current = { from: prevPathname, to: pathname };
   * const getNavigation = useCallback(() => navRef.current, []);
   */
  getNavigation?: () => NavigationInfo;
}

/**
 * Creates a NavigationDetector based on getNavigation()
 */
function createNavigationDetector(
  getNavigation: () => NavigationInfo,
): NavigationDetector {
  return {
    trigger() {
      // no-op - navigation is detected via getNavigation()
    },

    get(_type): Promise<NavigationPair | null> {
      const { from, to } = getNavigation();
      // Ignore if no navigation or same path (rerender)
      if (!from || !to || from === to) return Promise.resolve(null);

      return Promise.resolve({ from, to });
    },
  };
}

export const Ssgoi: React.FC<SsgoiProps> = React.memo(
  ({ config, children, getNavigation }) => {
    const contextValue = useMemo<ReactSsgoiContext>(() => {
      const { getTransition, hasMatchingTransition } =
        createSggoiTransitionContext(config, {
          createNavigationDetector: getNavigation
            ? () => createNavigationDetector(getNavigation)
            : createAnyOrderDetector,
        });

      const getInitialStyle = (): CSSProperties => {
        if (!getNavigation) {
          return {};
        }

        const { from, to } = getNavigation();

        // First render or same path - no style needed
        if (!from || from === to) {
          return {};
        }

        // Check if transition is configured for this navigation
        if (hasMatchingTransition(from, to)) {
          return { visibility: "hidden" };
        }

        return {};
      };

      return {
        getTransition,
        getInitialStyle,
      };
    }, [config, getNavigation]);

    return <SsgoiProvider value={contextValue}>{children}</SsgoiProvider>;
  },
);
