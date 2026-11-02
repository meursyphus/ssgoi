"use client";

import React, { useEffect, useMemo, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { SsgoiConfig } from "@ssgoi/core/types";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
} from "@ssgoi/core/internal";
import type { HostAnimation } from "@ssgoi/core/internal";
import { ssgoiContext } from "./context";
import { SsgoiFrameworkProvider, type SsgoiFramework } from "./layout-boundary";

const rootStyle: CSSProperties = { display: "contents" };

interface SsgoiProps {
  config: SsgoiConfig;
  /**
   * Optional external host that owns playback across transitions. Pass one in
   * (typically from `SsgoiDebugProvider`) to drive play/pause/rate from
   * outside the tree.
   */
  host?: HostAnimation;
  /**
   * How to read the router for `SsgoiLayoutBoundary`. The first boundary reads
   * the route and keys it against `config.layouts`. Keep the object stable.
   */
  framework?: SsgoiFramework;
  children: ReactNode;
}

export const Ssgoi: React.FC<SsgoiProps> = React.memo(
  ({ config, host, framework, children }) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const ssgoi = useMemo(
      () => createSggoiTransitionContext(config, { host }),
      [config, host],
    );

    useEffect(() => {
      const root = rootRef.current;
      if (!root) return;

      return observeSsgoiTransitions(root, ssgoi);
    }, [ssgoi]);

    return (
      <ssgoiContext.Provider value={ssgoi}>
        <div ref={rootRef} data-ssgoi-root="" style={rootStyle}>
          <SsgoiFrameworkProvider
            framework={framework}
            layouts={config.layouts}
          >
            {children}
          </SsgoiFrameworkProvider>
        </div>
      </ssgoiContext.Provider>
    );
  },
);
