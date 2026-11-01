import { createEffect, createMemo, onCleanup, type JSX } from "solid-js";
import type { SsgoiConfig, SsgoiContext, SsgoiFramework } from "./types";
import { SsgoiFrameworkProvider, SsgoiProvider } from "./context";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
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

  createEffect(() => {
    if (!root) return;
    const cleanup = observeSsgoiTransitions(root, contextValue());
    onCleanup(cleanup);
  });

  return (
    <SsgoiProvider value={contextValue()}>
      <SsgoiFrameworkProvider value={() => props.framework}>
        <div ref={root} data-ssgoi-root="" style={{ display: "contents" }}>
          {props.children}
        </div>
      </SsgoiFrameworkProvider>
    </SsgoiProvider>
  );
};
