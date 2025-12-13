"use client";
import React, { useMemo } from "react";
import type { ReactNode } from "react";
import type { SsgoiConfig, SsgoiContext } from "./types";
import { SsgoiProvider } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core";

interface SsgoiProps {
  config: SsgoiConfig;
  children: ReactNode;
}

export const Ssgoi: React.FC<SsgoiProps> = ({ config, children }) => {
  const contextValue = useMemo<SsgoiContext>(
    () =>
      createSggoiTransitionContext(config, {
        // React uses MutationObserver for unmount detection,
        // so OUT and IN can arrive in any order
        outFirst: false,
      }),
    [config],
  );

  return <SsgoiProvider value={contextValue}>{children}</SsgoiProvider>;
};
