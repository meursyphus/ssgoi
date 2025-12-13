import {
  transition as _transition,
  type Transition,
  type TransitionKey,
  type TransitionScope,
} from "@ssgoi/core";

type TransitionParams = Transition<undefined> & {
  key?: TransitionKey;
  scope?: TransitionScope;
};

/**
 * Svelte action for element transitions
 *
 * Uses Svelte's destroy callback for OUT transition detection.
 * This ensures the correct transition config is used even when
 * params are updated (e.g., during SvelteKit page navigation).
 */
export const transition = (node: HTMLElement, params: TransitionParams) => {
  let callback = _transition({
    key: params?.key,
    in: params?.in,
    out: params?.out,
    ref: node,
    scope: params?.scope,
  });
  let cleanup = callback(node);

  return {
    update(newParams: TransitionParams) {
      callback = _transition({
        key: newParams?.key,
        in: newParams?.in,
        out: newParams?.out,
        ref: node,
        scope: newParams?.scope,
      });
      cleanup = callback(node);
    },
    destroy() {
      // Call cleanup to trigger OUT transition with the correct config
      // The cleanup function captures the transition config at registration time
      cleanup?.();
    },
  };
};
