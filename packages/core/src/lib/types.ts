export type TransitionConfig = {
  duration?: number;
  easing?: (t: number) => number;
  tick?: (t: number) => void;
};

export type GetTransitionConfig<T extends HTMLElement> = (
  node: T
) => TransitionConfig | Promise<TransitionConfig>;

export type Transition<E extends HTMLElement = HTMLElement> = {
  in: GetTransitionConfig<E>;
  out: GetTransitionConfig<E>;
};

export type TransitionCallback<T extends HTMLElement = HTMLElement> = (
  element: T
) => void | (() => void);
