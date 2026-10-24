import type { ComponentChildren } from "preact";
import { useLayoutEffect, useMemo, useRef } from "preact/hooks";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
  type HostAnimation,
} from "@ssgoi/core/internal";
import type { SsgoiConfig } from "@ssgoi/core/types";
import { ssgoiContext } from "./context";

export interface SsgoiProps {
  config: SsgoiConfig;
  host?: HostAnimation;
  children?: ComponentChildren;
}

/** Keep this provider mounted above keyed page boundaries. */
export function Ssgoi({ config, host, children }: SsgoiProps) {
  const root = useRef<HTMLDivElement>(null);
  const context = useMemo(
    () => createSggoiTransitionContext(config, { host }),
    [config, host],
  );

  useLayoutEffect(() => {
    if (root.current) return observeSsgoiTransitions(root.current, context);
  }, [context]);

  return (
    <ssgoiContext.Provider value={context}>
      <div ref={root} data-ssgoi-root="" style={{ display: "contents" }}>
        {children}
      </div>
    </ssgoiContext.Provider>
  );
}
