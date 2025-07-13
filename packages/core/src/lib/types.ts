export type TransitionKey = string | symbol;

export type SpringConfig = {
  stiffness: number; // 0-1000, default: 100
  damping: number; // 0-100, default: 10
};

export type TransitionConfig = {
  // Spring physics configuration
  spring: SpringConfig;

  // Callback for each frame with progress value (0-1)
  tick?: (progress: number) => void;
};

export type GetTransitionConfig<T extends HTMLElement> = (
  node: T
) => TransitionConfig | Promise<TransitionConfig>;

export type Transition<E extends HTMLElement = HTMLElement> = {
  in?: GetTransitionConfig<E>;
  out?: GetTransitionConfig<E>;
};

export type TransitionCallback<T extends HTMLElement = HTMLElement> = (
  element: T
) => void | (() => void);
