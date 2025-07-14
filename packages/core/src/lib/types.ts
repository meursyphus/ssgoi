export type TransitionKey = string | symbol;

export type SpringConfig = {
  stiffness: number; 
  damping: number; 
};

export type TransitionConfig = {
  // Spring physics configuration
  spring: SpringConfig;

  // Callback for each frame with progress value (0-1)
  tick?: (progress: number) => void;
};

export type GetTransitionConfig = (
  node: HTMLElement
) => TransitionConfig | Promise<TransitionConfig>;

export type Transition = {
  in?: GetTransitionConfig;
  out?: GetTransitionConfig;
};

export type TransitionCallback = (
  element: HTMLElement
) => void | (() => void);