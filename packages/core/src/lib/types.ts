export type TransitionConfig = {
  duration?: number;
  easing?: (t: number) => number;
  tick?: (t: number) => void;
};

export type GetTransitionConfig<T extends Element> = (
  node: T
) => TransitionConfig | Promise<TransitionConfig>;

export type Transition<E extends Element = Element> = {
  in: GetTransitionConfig<E>;
  out: GetTransitionConfig<E>;
};

export type TransitionCallback<T extends Element = Element> = (
  element: T
) => void | (() => void);
