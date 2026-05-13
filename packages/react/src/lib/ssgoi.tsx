"use client";

import React, { useMemo } from "react";
import type { ReactNode } from "react";
import type { SsgoiConfig } from "@ssgoi/core/types";
import { SsgoiProvider } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core/internal";

interface SsgoiProps {
  config: SsgoiConfig;
  children: ReactNode;
}

export const Ssgoi: React.FC<SsgoiProps> = React.memo(
  ({ config, children }) => {
    const ssgoi = useMemo(() => createSggoiTransitionContext(config), [config]);
    return <SsgoiProvider value={ssgoi}>{children}</SsgoiProvider>;
  },
);
