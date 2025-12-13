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
 * OUT transition is automatically triggered by MutationObserver
 * when the element is removed from the DOM - no destroy() needed
 */
export const transition = (node: HTMLElement, params: TransitionParams) => {
  let callback = _transition({
    key: params?.key,
    in: params?.in,
    out: params?.out,
    ref: node,
    scope: params?.scope,
  });
  callback(node);

  return {
    update(newParams: TransitionParams) {
      callback = _transition({
        key: newParams?.key,
        in: newParams?.in,
        out: newParams?.out,
        ref: node,
        scope: newParams?.scope,
      });
      callback(node);
    },
  };
};
