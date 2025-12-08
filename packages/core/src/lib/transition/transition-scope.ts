import type { TransitionCallback } from "../types";

const SCOPE_ATTR = "data-ssgoi-scope";
const SCOPE_READY_ATTR = "data-ssgoi-scope-ready";

/**
 * Creates a transition scope that controls child transition behavior.
 *
 * When a child transition has `scope: 'local'`:
 * - If child mounts simultaneously with scope → skip IN animation
 * - If child unmounts simultaneously with scope → skip OUT animation
 * - If child mounts/unmounts while scope is stable → run animation
 *
 * @returns A ref callback to attach to the scope container element
 *
 * @example
 * ```tsx
 * // React
 * <div ref={createTransitionScope()} style={{ display: 'contents' }}>
 *   <div ref={transition(fadeIn(), { scope: 'local' })}>
 *     Content
 *   </div>
 * </div>
 * ```
 */
export function createTransitionScope(): TransitionCallback {
  return (element: HTMLElement | null) => {
    if (!element) return;

    element.setAttribute(SCOPE_ATTR, "");

    // Mark as ready after double microtask
    // This ensures children's microtask checks run before scope is marked ready
    queueMicrotask(() => {
      queueMicrotask(() => {
        element.setAttribute(SCOPE_READY_ATTR, "true");
      });
    });

    return () => {
      // Cleanup - attributes will be removed with the element
    };
  };
}

/**
 * Check if scope element is ready (mounted and initial render complete)
 * @internal
 */
export function isScopeReady(scope: Element): boolean {
  return scope.hasAttribute(SCOPE_READY_ATTR);
}

/**
 * Find the closest transition scope element
 * @internal
 */
export function findScope(element: Element): Element | null {
  return element.closest(`[${SCOPE_ATTR}]`);
}

export { SCOPE_ATTR, SCOPE_READY_ATTR };
