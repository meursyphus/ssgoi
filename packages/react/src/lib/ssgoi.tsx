"use client";
import React, { useMemo, useRef } from "react";
import type { ReactNode, CSSProperties } from "react";
import type { SsgoiConfig, ReactSsgoiContext } from "./types";
import { SsgoiProvider } from "./context";
import {
  createSggoiTransitionContext,
  createAnyOrderDetector,
} from "@ssgoi/core";
import { createPathnameDetector } from "./create-pathname-detector";

interface SsgoiProps {
  config: SsgoiConfig;
  children: ReactNode;
  /**
   * Function to get current pathname
   * Used to determine initial style and navigation detection
   * @example Next.js: () => usePathname()
   */
  getPathname?: () => string;
}

export const Ssgoi: React.FC<SsgoiProps> = React.memo(
  ({ config, children, getPathname }) => {
    // Track previous pathname for style detection
    const prevPathnameRef = useRef<string | null>(null);

    const contextValue = useMemo<ReactSsgoiContext>(() => {
      const { getTransition, hasMatchingTransition } =
        createSggoiTransitionContext(config, {
          // React uses MutationObserver for unmount detection,
          // so OUT and IN can arrive in any order
          outFirst: false,
          // Use pathname-based detector when getPathname is provided,
          // otherwise use default any-order detector for React
          createNavigationDetector: getPathname
            ? () => createPathnameDetector(getPathname)
            : createAnyOrderDetector,
        });

      const getInitialStyle = (path: string): CSSProperties => {
        if (!getPathname) {
          // No pathname detector - no style needed (no flash prevention)
          return {};
        }

        const currentPathname = getPathname();

        // First render or same path - no style needed
        if (
          !prevPathnameRef.current ||
          prevPathnameRef.current === currentPathname
        ) {
          prevPathnameRef.current = currentPathname;
          return {};
        }

        // Check if transition is configured for this navigation
        const fromPath = prevPathnameRef.current;
        prevPathnameRef.current = currentPathname;

        if (hasMatchingTransition(fromPath, path)) {
          return { visibility: "hidden" };
        }

        return {};
      };

      return {
        getTransition,
        getInitialStyle,
      };
    }, [config, getPathname]);

    return <SsgoiProvider value={contextValue}>{children}</SsgoiProvider>;
  },
);
