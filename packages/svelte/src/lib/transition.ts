import {
  transition as _transition,
  type Transition,
  type TransitionKey,
} from "@ssgoi/core";

export const transition = <TAnimationValue = number>(
  node: HTMLElement,
  params: Transition<undefined, TAnimationValue> & { key?: TransitionKey },
) => {
  let callback = _transition<TAnimationValue>({
    key: params?.key,
    in: params?.in,
    out: params?.out,
    ref: node,
  });
  let cleanup = callback(node);


  return {
    update(
      newParams: Transition<undefined, TAnimationValue> & {
        key?: TransitionKey;
      },
    ) {
      callback = _transition<TAnimationValue>({
        key: newParams?.key,
        in: newParams?.in,
        out: newParams?.out,
        ref: node,
      });
      cleanup = callback(node);
    },
    destroy() {
      cleanup?.();
    },
  };
};
