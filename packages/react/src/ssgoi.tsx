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
import type { SsgoiFramework } from "./layout-boundary";

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
   * Router hooks for `SsgoiLayoutBoundary`, e.g.
   * `{ usePathname, useSelectedLayoutSegments }` from `next/navigation`.
   * Keep the object stable: its hooks are called on every boundary render.
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

    const value = useMemo(() => ({ ssgoi, framework }), [ssgoi, framework]);

    return (
      <ssgoiContext.Provider value={value}>
        <div ref={rootRef} data-ssgoi-root="" style={rootStyle}>
          {children}
        </div>
      </ssgoiContext.Provider>
    );
  },
);
