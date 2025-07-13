import {
  transition as _transition,
  type Transition,
  type TransitionKey,
} from "@ssgoi/core";

export const transition = (
  node: HTMLElement,
  params: Transition<HTMLElement> & { key: TransitionKey }
) => {
  let callback = _transition({
    key: params.key,
    in: params.in,
    out: params.out,
  });
  let cleanup = callback(node);

  return {
    update(newParams: Transition<HTMLElement> & { key: TransitionKey }) {
      callback = _transition({
        key: newParams.key,
        in: newParams.in,
        out: newParams.out,
      });
      cleanup = callback(node);
    },
    destroy() {
      cleanup?.();
    },
  };
};
