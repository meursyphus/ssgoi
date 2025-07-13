export type TransitionConfig = {
  duration: number;
  easing: (t: number) => number;
  tick: (t: number) => void;
};

export type TranstionFunction = (
  node: Element
) => TransitionConfig | Promise<TransitionConfig>;

export type Transition<T = any> = (params?: T) => {
  in: TranstionFunction;
  out: TranstionFunction;
};
