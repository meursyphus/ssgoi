"use client";
import React, { useMemo } from "react";
import type { ReactNode } from "react";
import type { SsgoiConfig, ReactSsgoiContext } from "./types";
import { SsgoiProvider } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core";

interface SsgoiProps {
  config: SsgoiConfig;
  children: ReactNode;
}

export const Ssgoi: React.FC<SsgoiProps> = React.memo(
  ({ config, children }) => {
    const contextValue = useMemo<ReactSsgoiContext>(
      () => ({
        getTransition: createSggoiTransitionContext(config, {
          outFirst: false,
        }),
      }),
      [config],
    );

    return <SsgoiProvider value={contextValue}>{children}</SsgoiProvider>;
  },
);
