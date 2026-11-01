import {
  inject,
  onScopeDispose,
  provide,
  shallowReadonly,
  shallowRef,
  watch,
  type ComputedRef,
  type InjectionKey,
  type ShallowRef,
} from "vue";
import type { SsgoiContext, SsgoiTransitionState } from "./types";

/** Route state `<Ssgoi>` resolves once for every layout boundary below it. */
export interface SsgoiLayoutState {
  routePath: string;
  chain: string[];
}

type SsgoiContextRef = ComputedRef<SsgoiContext>;
type SsgoiLayoutRef = ComputedRef<SsgoiLayoutState | undefined>;

const SsgoiContextKey: InjectionKey<SsgoiContextRef> = Symbol("ssgoi-context");
const SsgoiLayoutKey: InjectionKey<SsgoiLayoutRef> = Symbol("ssgoi-layout");
const SsgoiLayoutDepthKey: InjectionKey<number> = Symbol("ssgoi-layout-depth");

export const provideSsgoi = (
  context: SsgoiContextRef,
  layout: SsgoiLayoutRef,
) => {
  provide(SsgoiContextKey, context);
  provide(SsgoiLayoutKey, layout);
};

/** Layout state of the nearest `<Ssgoi>`; undefined without a framework. */
export const useSsgoiLayout = (): SsgoiLayoutRef | undefined =>
  inject(SsgoiLayoutKey, undefined);

/** Depth of the calling layout boundary; its descendants see one deeper. */
export const useLayoutDepth = (): number => {
  const depth = inject(SsgoiLayoutDepthKey, 0);
  provide(SsgoiLayoutDepthKey, depth + 1);
  return depth;
};

export const useSsgoi = (): SsgoiContextRef => {
  const context = inject(SsgoiContextKey);
  if (!context) {
    throw new Error("useSsgoi must be used within Ssgoi component");
  }
  return context;
};

/**
 * Ref of the provider's transition lifecycle: whether a page transition is
 * preparing or playing, and which routes it joins.
 *
 * Use it to defer work that would fight the animation, such as a programmatic
 * scroll on the arriving page, until the status returns to `"idle"`.
 *
 * Must be called in `setup()`, under `<Ssgoi>`.
 */
export const useSsgoiTransition = (): Readonly<
  ShallowRef<SsgoiTransitionState>
> => {
  const context = inject(SsgoiContextKey);
  if (!context) {
    throw new Error("useSsgoiTransition must be used within Ssgoi component");
  }
  const state = shallowRef<SsgoiTransitionState>(
    context.value.getTransitionState(),
  );
  let unsubscribe: (() => void) | undefined;
  watch(
    context,
    (ssgoi) => {
      unsubscribe?.();
      state.value = ssgoi.getTransitionState();
      unsubscribe = ssgoi.subscribe((next) => {
        state.value = next;
      });
    },
    { immediate: true },
  );
  onScopeDispose(() => unsubscribe?.());
  return shallowReadonly(state);
};
