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
  prepareOutgoing?: (element: HTMLElement) => void;
};

export type TransitionCallback = (
  element: HTMLElement | null
) => void | (() => void);

export type SsgoiConfig = {
  transitions: { from: string; to: string; transition: Transition }[];
  defaultTransition?: Transition;
};

export type SsgoiContext = (key: string) => Transition & { key: TransitionKey };
