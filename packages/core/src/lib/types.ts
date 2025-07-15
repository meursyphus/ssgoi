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
  
  // Prepare element before animation (typically for out transitions)
  prepare?: (element: HTMLElement) => void;
  
  // Called when animation starts
  onStart?: () => void;
  
  // Called when animation ends
  onEnd?: () => void;
};

export type GetTransitionConfig = (
  node: HTMLElement
) => TransitionConfig | Promise<TransitionConfig>;

export type Transition = {
  in?: GetTransitionConfig;
  out?: GetTransitionConfig;
};

export type TransitionCallback = (
  element: HTMLElement | null
) => void | (() => void);

export type SsgoiConfig = {
  transitions: { from: string; to: string; transition: Transition }[];
  defaultTransition?: Transition;
};

export type SsgoiContext = (path: string) => Transition & { key: TransitionKey };
