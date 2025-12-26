"use client";
import React, { useMemo, useRef, useCallback } from "react";
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
   * Hook to get current pathname (e.g., Next.js usePathname)
   * @example
   * import { usePathname } from 'next/navigation';
   * <Ssgoi config={config} usePathname={usePathname}>
   */
  usePathname?: () => string;
}

/**
 * Hook to track navigation (prev/current pathname)
 * Returns a stable getNavigation function
 */
function useNavigation(pathname: string | null): () => NavigationInfo {
  const currentRef = useRef<string | null>(null);
  const prevRef = useRef<string | null>(null);

  // Update prev only when pathname actually changes
  if (pathname !== null && currentRef.current !== pathname) {
    prevRef.current = currentRef.current;
    currentRef.current = pathname;
  }

  // Keep navigation info in ref
  const navigationRef = useRef<NavigationInfo>({ from: null, to: "" });
  if (pathname !== null) {
    navigationRef.current = { from: prevRef.current, to: pathname };
  }

  // Stable getNavigation function
  return useCallback(() => navigationRef.current, []);
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
  ({ config, children, usePathname }) => {
    // Call the pathname hook if provided
    const pathname = usePathname?.() ?? null;

    // Track navigation internally
    const getNavigation = useNavigation(pathname);

    const contextValue = useMemo<ReactSsgoiContext>(() => {
      const { getTransition, hasMatchingTransition } =
        createSggoiTransitionContext(config, {
          createNavigationDetector: usePathname
            ? () => createNavigationDetector(getNavigation)
            : createAnyOrderDetector,
        });

      const getInitialStyle = (): CSSProperties => {
        if (!usePathname) {
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
    }, [config, usePathname, getNavigation]);

    return <SsgoiProvider value={contextValue}>{children}</SsgoiProvider>;
  },
);
