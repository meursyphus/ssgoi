import { createMemo, type JSX } from "solid-js";
import type { SsgoiConfig, SsgoiContext } from "./types";
import { SsgoiProvider } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core/internal";
import type { HostAnimation } from "@ssgoi/core/internal";

interface SsgoiProps {
  config: SsgoiConfig;
  host?: HostAnimation;
  children: JSX.Element;
}

export const Ssgoi = (props: SsgoiProps) => {
  const contextValue = createMemo<SsgoiContext>(() =>
    createSggoiTransitionContext(props.config, { host: props.host }),
  );

  return <SsgoiProvider value={contextValue()}>{props.children}</SsgoiProvider>;
};
