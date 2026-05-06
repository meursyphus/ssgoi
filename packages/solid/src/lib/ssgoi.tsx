import { createMemo, type JSX } from "solid-js";
import type { SsgoiConfig, SsgoiContext } from "./types";
import { SsgoiProvider } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core/internal";

interface SsgoiProps {
  config: SsgoiConfig;
  children: JSX.Element;
}

export const Ssgoi = (props: SsgoiProps) => {
  const contextValue = createMemo<SsgoiContext>(() =>
    createSggoiTransitionContext(props.config),
  );

  return <SsgoiProvider value={contextValue()}>{props.children}</SsgoiProvider>;
};
