import {
  createContext,
  createSignal,
  onCleanup,
  useContext,
  type Accessor,
} from "solid-js";
import type { SsgoiContext, SsgoiTransitionState } from "./types";

const SsgoiContextInstance = createContext<SsgoiContext | null>(null);

export const SsgoiProvider = SsgoiContextInstance.Provider;

export const useSsgoi = () => {
  const context = useContext(SsgoiContextInstance);
  if (!context) {
    throw new Error("useSsgoi must be used within SsgoiProvider");
  }
  return context;
};

/**
 * Signal of the provider's transition lifecycle: whether a page transition is
 * preparing or playing, and which routes it joins.
 *
 * Use it to defer work that would fight the animation, such as a programmatic
 * scroll on the arriving page, until the status returns to `"idle"`.
 *
 * Must be called under `<Ssgoi>`.
 */
export const useSsgoiTransition = (): Accessor<SsgoiTransitionState> => {
  const context = useContext(SsgoiContextInstance);
  if (!context) {
    throw new Error("useSsgoiTransition must be used within <Ssgoi>");
  }
  const [state, setState] = createSignal<SsgoiTransitionState>(
    context.getTransitionState(),
  );
  onCleanup(context.subscribe((next) => setState(() => next)));
  return state;
};
