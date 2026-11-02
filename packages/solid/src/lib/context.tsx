import {
  createContext,
  createSignal,
  onCleanup,
  useContext,
  type Accessor,
} from "solid-js";
import type { SsgoiContext, SsgoiTransitionState } from "./types";

/** Route state `<Ssgoi>` resolves once for every layout boundary below it. */
export interface SsgoiLayoutState {
  routePath: string;
  chain: string[];
}

const SsgoiContextInstance = createContext<SsgoiContext | null>(null);
const SsgoiLayoutContext = createContext<
  Accessor<SsgoiLayoutState | undefined> | undefined
>(undefined);
const SsgoiLayoutDepthContext = createContext(0);

export const SsgoiProvider = SsgoiContextInstance.Provider;
export const SsgoiLayoutProvider = SsgoiLayoutContext.Provider;
/** Gives descendants of a layout boundary their depth. */
export const SsgoiLayoutDepthProvider = SsgoiLayoutDepthContext.Provider;

/** Layout state of the nearest `<Ssgoi>`; undefined without a framework. */
export const useSsgoiLayout = () => useContext(SsgoiLayoutContext);

/** Depth of the calling layout boundary: 0 unless inside another. */
export const useLayoutDepth = () => useContext(SsgoiLayoutDepthContext);

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
