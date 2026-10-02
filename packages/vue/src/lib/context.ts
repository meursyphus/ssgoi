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

type SsgoiContextRef = ComputedRef<SsgoiContext>;

const SsgoiContextKey: InjectionKey<SsgoiContextRef> = Symbol("ssgoi-context");

export const provideSsgoi = (context: SsgoiContextRef) => {
  provide(SsgoiContextKey, context);
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
