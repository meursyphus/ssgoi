import {
  component$,
  Slot,
  useSignal,
  useVisibleTask$,
  type QRL,
  type NoSerialize,
  type Signal,
} from "@builder.io/qwik";
import {
  transition as _transition,
  type TransitionConfig,
  type TransitionScope,
} from "@ssgoi/core";
import type { SsgoiContext } from "./types";

type GetTransitionConfig = (
  element: HTMLElement,
) => TransitionConfig | Promise<TransitionConfig>;

export type TransitionProps = {
  /** Transition key for identification (string only in Qwik - symbols can't be serialized) */
  transitionKey?: string;
  /** Transition scope */
  scope?: TransitionScope;
  /** IN transition config function (QRL for direct usage) */
  in$?: QRL<GetTransitionConfig>;
  /** OUT transition config function (QRL for direct usage) */
  out$?: QRL<GetTransitionConfig>;
  /** CSS class for the wrapper element */
  class?: string;
};

/** @internal Props used internally by SsgoiTransition */
export type TransitionInternalProps = TransitionProps & {
  /** IN transition config function (noSerialize for context usage) */
  inFn?: NoSerialize<GetTransitionConfig>;
  /** OUT transition config function (noSerialize for context usage) */
  outFn?: NoSerialize<GetTransitionConfig>;
  /** Context signal for page transitions */
  contextSignal?: Signal<NoSerialize<SsgoiContext> | null>;
  /** Page ID for getting transition config from context */
  pageId?: string;
};

/**
 * @internal Internal transition component used by SsgoiTransition
 */
export const TransitionInternal = component$<TransitionInternalProps>(
  ({
    transitionKey,
    scope,
    in$,
    out$,
    inFn,
    outFn,
    class: className,
    contextSignal,
    pageId,
  }) => {
    const elementRef = useSignal<HTMLElement>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(
      async ({ cleanup, track }) => {
        const element = elementRef.value;
        track(elementRef);

        // Track context signal if provided - this makes the task re-run when context is ready
        const context = contextSignal ? track(() => contextSignal.value) : null;

        if (!element) return;

        let resolvedIn: GetTransitionConfig | undefined;
        let resolvedOut: GetTransitionConfig | undefined;

        // If context and pageId provided, get functions from context
        if (context && pageId) {
          const options = context(pageId);
          resolvedIn = options.in;
          resolvedOut = options.out;
        } else {
          // Use direct props (QRLs or noSerialize functions)
          resolvedIn = in$ ? await in$.resolve() : inFn;
          resolvedOut = out$ ? await out$.resolve() : outFn;
        }

        if (!resolvedIn && !resolvedOut) return;

        // Generate a unique key if not provided
        const key =
          transitionKey ||
          `qwik-transition-${Math.random().toString(36).slice(2)}`;

        const callback = _transition({
          key,
          scope,
          in: resolvedIn,
          out: resolvedOut,
        });

        const transitionCleanup = callback(element);

        // Qwik's cleanup handles unmount - no need for watchUnmount!
        cleanup(() => {
          transitionCleanup?.();
        });
      },
      {
        strategy: "document-ready",
      },
    );

    return (
      <div ref={elementRef} class={className}>
        <Slot />
      </div>
    );
  },
);

/**
 * Qwik component wrapper for element transitions
 *
 * Uses useVisibleTask$ internally for SSR-safe transitions.
 * The cleanup callback handles unmount automatically - no watchUnmount needed.
 *
 * @example
 * ```tsx
 * <Transition
 *   in$={$((el) => ({
 *     tick: (p) => el.style.opacity = String(p)
 *   }))}
 *   out$={$((el) => ({
 *     tick: (p) => el.style.opacity = String(p)
 *   }))}
 * >
 *   <div>Animated content</div>
 * </Transition>
 * ```
 */
export const Transition = component$<TransitionProps>(
  ({ transitionKey, scope, in$, out$, class: className }) => {
    return (
      <TransitionInternal
        transitionKey={transitionKey}
        scope={scope}
        in$={in$}
        out$={out$}
        class={className}
      >
        <Slot />
      </TransitionInternal>
    );
  },
);
