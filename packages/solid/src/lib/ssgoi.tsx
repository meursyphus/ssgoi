import { createEffect, createMemo, onCleanup, type JSX } from "solid-js";
import type { SsgoiConfig, SsgoiContext, SsgoiFramework } from "./types";
import { SsgoiLayoutProvider, SsgoiProvider } from "./context";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
  resolveLayoutChain,
} from "@ssgoi/core/internal";
import type { HostAnimation } from "@ssgoi/core/internal";

interface SsgoiProps {
  config: SsgoiConfig;
  host?: HostAnimation;
  framework?: SsgoiFramework;
  children: JSX.Element;
}

export const Ssgoi = (props: SsgoiProps) => {
  let root!: HTMLDivElement;
  const contextValue = createMemo<SsgoiContext>(() =>
    createSggoiTransitionContext(props.config, { host: props.host }),
  );

  // Resolve the route once; every SsgoiLayoutBoundary keys off this chain.
  const layout = createMemo(() => {
    const route = props.framework?.getRoute();
    if (!route) return undefined;
    const routePath = route.renderedPath ?? route.pathname;
    return {
      routePath,
      chain: resolveLayoutChain(props.config.layouts, routePath),
    };
  });

  createEffect(() => {
    if (!root) return;
    const cleanup = observeSsgoiTransitions(root, contextValue());
    onCleanup(cleanup);
  });

  return (
    <SsgoiProvider value={contextValue()}>
      <SsgoiLayoutProvider value={layout}>
        <div ref={root} data-ssgoi-root="" style={{ display: "contents" }}>
          {props.children}
        </div>
      </SsgoiLayoutProvider>
    </SsgoiProvider>
  );
};
