"use client";

import React, { useMemo } from "react";
import type { ReactNode } from "react";
import type { SsgoiConfig } from "@ssgoi/core/types";
import { SsgoiProvider } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core/internal";
import type { HostAnimation } from "@ssgoi/core/internal";

interface SsgoiProps {
  config: SsgoiConfig;
  /**
   * Optional external host that owns playback across transitions. Pass one in
   * (typically from `SsgoiDebugProvider`) to drive play/pause/rate from
   * outside the tree.
   */
  host?: HostAnimation;
  children: ReactNode;
}

export const Ssgoi: React.FC<SsgoiProps> = React.memo(
  ({ config, host, children }) => {
    const ssgoi = useMemo(
      () => createSggoiTransitionContext(config, { host }),
      [config, host],
    );
    return <SsgoiProvider value={ssgoi}>{children}</SsgoiProvider>;
  },
);
