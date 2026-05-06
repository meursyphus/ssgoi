import {
  transition as _transition,
  type Transition,
  type TransitionKey,
  type TransitionScope,
} from "@ssgoi/core/internal";

type TransitionParams = Transition<undefined> & {
  key: TransitionKey;
  scope?: TransitionScope;
};

/**
 * Svelte action for element transitions
 *
 * OUT transition is automatically triggered by MutationObserver
 * when the element is removed from the DOM.
 */
export const transition = (node: HTMLElement, params: TransitionParams) => {
  // Pass params through as-is to preserve symbol properties such as
  // TRANSITION_STRATEGY on page transition configs.
  const ref = _transition(params, "auto");
  ref(node);

  return {
    update(newParams: TransitionParams) {
      _transition(newParams, "auto");
    },
  };
};
