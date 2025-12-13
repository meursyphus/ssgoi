import {
  createContextId,
  useContext,
  type Signal,
  type NoSerialize,
} from "@builder.io/qwik";
import type { SsgoiContext } from "./types";

export const SsgoiContextId =
  createContextId<Signal<NoSerialize<SsgoiContext> | null>>("ssgoi-context");

export const useSsgoi = () => {
  const contextSignal = useContext(SsgoiContextId);
  return contextSignal;
};
