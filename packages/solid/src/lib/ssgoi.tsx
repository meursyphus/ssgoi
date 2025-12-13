import { createMemo, type JSX } from "solid-js";
import type { SsgoiConfig, SsgoiContext } from "./types";
import { SsgoiProvider } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core";

interface SsgoiProps {
  config: SsgoiConfig;
  children: JSX.Element;
}

export const Ssgoi = (props: SsgoiProps) => {
  const contextValue = createMemo<SsgoiContext>(() =>
    createSggoiTransitionContext(props.config, {
      // Solid uses MutationObserver for unmount detection,
      // so OUT and IN can arrive in any order
      outFirst: false,
    }),
  );

  return <SsgoiProvider value={contextValue()}>{props.children}</SsgoiProvider>;
};
