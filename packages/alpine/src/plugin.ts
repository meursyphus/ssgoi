import type { Alpine } from "alpinejs";
import type { Animation, SsgoiConfig, SsgoiTransitionState } from "@ssgoi/core";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
  IDLE_TRANSITION_STATE,
} from "@ssgoi/core/internal";

/** Return a fresh core Animation for each element/evaluation. */
export type SsgoiMotionFactory = (element: HTMLElement) => Animation;

function restoreAttribute(
  element: HTMLElement,
  name: string,
  value: string | null,
) {
  if (value === null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

/** Register before Alpine.start(). Importing this module does not access the DOM. */
export function ssgoi(Alpine: Alpine): void {
  const states = new WeakMap<Element, { current: SsgoiTransitionState }>();
  Alpine.magic("ssgoi", (element) => {
    let ancestor: Element | null = element;
    while (ancestor) {
      const state = states.get(ancestor);
      if (state) return state.current;
      ancestor = ancestor.parentElement;
    }
    return IDLE_TRANSITION_STATE;
  });

  Alpine.directive(
    "ssgoi",
    (element, { expression }, { evaluateLater, effect, cleanup }) => {
      if (element.closest("[data-ssgoi-clone]")) return;
      const previousRoot = element.getAttribute("data-ssgoi-root");
      element.setAttribute("data-ssgoi-root", "");
      const state = Alpine.reactive<{ current: SsgoiTransitionState }>({
        current: IDLE_TRANSITION_STATE,
      });
      states.set(element, state);
      let stop: (() => void) | undefined;
      let generation = 0;
      let disposed = false;
      const evaluate = evaluateLater<SsgoiConfig>(expression || "{}");

      effect(() => {
        const current = ++generation;
        evaluate((config) => {
          if (disposed || current !== generation) return;
          // Keep this read in Alpine's effect so nested config changes are tracked.
          // Core creates a new dispatcher when a configuration changes.
          stop?.();
          stop = undefined;
          const context = createSggoiTransitionContext(config ?? {});
          state.current = context.getTransitionState();
          const unsubscribe = context.subscribe((value) => {
            state.current = value;
          });
          const registered = new WeakSet<HTMLElement>();
          const register = context.register;
          context.register = (path, page, options) => {
            registered.add(page);
            register(path, page, options);
          };
          // Core reuses detached outgoing DOM for its exit animation. Alpine
          // destroys x-if/x-for scopes on removal; prevent its global observer
          // from initializing that retired subtree again when core reinserts it.
          const retiredPages = new MutationObserver((mutations) => {
            const retire = (node: Node) => {
              if (!(node instanceof HTMLElement) || node.isConnected) return;
              if (registered.has(node)) node.setAttribute("x-ignore", "");
              for (const child of node.children) retire(child);
            };
            for (const mutation of mutations)
              for (const node of mutation.removedNodes) retire(node);
          });
          retiredPages.observe(element, { childList: true, subtree: true });
          let stopObserving: (() => void) | undefined;
          stop = () => {
            retiredPages.disconnect();
            unsubscribe();
            if (stopObserving) stopObserving();
            else context.disconnect?.();
            state.current = IDLE_TRANSITION_STATE;
          };
          // Alpine initializes descendants synchronously. Waiting one microtask
          // lets nested providers mark their roots before the initial DOM scan.
          queueMicrotask(() => {
            if (disposed || current !== generation) return;
            stopObserving = observeSsgoiTransitions(element, context);
          });
        });
      });

      cleanup(() => {
        disposed = true;
        generation++;
        stop?.();
        states.delete(element);
        restoreAttribute(element, "data-ssgoi-root", previousRoot);
      });
    },
  ).before("bind");

  Alpine.directive(
    "ssgoi-page",
    (element, { expression }, { evaluateLater, effect, cleanup }) => {
      if (element.closest("[data-ssgoi-clone]")) return;
      const previousPath = element.getAttribute("data-ssgoi-transition");
      const evaluate = evaluateLater<string>(expression);
      let disposed = false;
      let generation = 0;
      effect(() => {
        const current = ++generation;
        evaluate((path) => {
          if (disposed || current !== generation) return;
          if (typeof path !== "string" || path.length === 0) {
            throw new Error("x-ssgoi-page requires a non-empty string path");
          }
          element.setAttribute("data-ssgoi-transition", path);
        });
      });
      cleanup(() => {
        disposed = true;
        generation++;
        restoreAttribute(element, "data-ssgoi-transition", previousPath);
      });
    },
  );

  Alpine.directive(
    "ssgoi-motion",
    (element, { expression }, { evaluateLater, effect, cleanup }) => {
      if (element.closest("[data-ssgoi-clone]")) return;
      // Wrapping the value in an object prevents Alpine from auto-invoking a
      // returned function before we can pass its target element.
      const evaluate = evaluateLater<{ factory: SsgoiMotionFactory | null }>(
        `({ factory: (${expression}) })`,
      );
      let animation: Animation | undefined;
      let disposed = false;
      let generation = 0;
      const cancel = (reason: "disposed" | "interrupted") => {
        animation?.cancel({ reason, owns: (target) => target === element });
        animation = undefined;
      };
      effect(() => {
        const current = ++generation;
        evaluate(({ factory }) => {
          if (disposed || current !== generation) return;
          cancel("interrupted");
          if (!factory) return;
          animation = factory(element);
          animation.play();
        });
      });
      cleanup(() => {
        disposed = true;
        generation++;
        cancel("disposed");
      });
    },
  );
}
