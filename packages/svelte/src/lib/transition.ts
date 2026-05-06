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
 * Uses Svelte's destroy callback for OUT transition detection.
 * This ensures the correct transition config is used even when
 * params are updated (e.g., during SvelteKit page navigation).
 */
export const transition = (node: HTMLElement, params: TransitionParams) => {
  const ref = _transition(
    {
      key: params.key,
      in: params.in,
      out: params.out,
      scope: params.scope,
    },
    "auto",
  );
  ref(node);

  return {
    update(newParams: TransitionParams) {
      _transition(
        {
          key: newParams.key,
          in: newParams.in,
          out: newParams.out,
          scope: newParams.scope,
        },
        "auto",
      );
    },
  };
};
