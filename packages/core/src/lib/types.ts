export type TransitionKey = string | symbol;

export type SpringConfig = {
  stiffness?: number;
  damping?: number;
};

export type TransitionConfig = {
  // Spring physics configuration
  spring?: SpringConfig; // Default: { stiffness: 300, damping: 30 }

  // Callback for each frame with progress value (0-1)
  tick?: (progress: number) => void;

  // Prepare element before animation (typically for out transitions)
  prepare?: (element: HTMLElement) => void;

  // Called when animation starts
  onStart?: () => void;

  // Called when animation ends
  onEnd?: () => void;
};

export type GetTransitionConfig<TContext = undefined> =
  TContext extends undefined
    ? (node: HTMLElement) => TransitionConfig | Promise<TransitionConfig>
    : (
        node: HTMLElement,
        context: TContext
      ) => TransitionConfig | Promise<TransitionConfig>;

export type Transition<TContext = undefined> = {
  in?: GetTransitionConfig<TContext>;
  out?: GetTransitionConfig<TContext>;
};

export type TransitionCallback = (
  element: HTMLElement | null
) => void | (() => void);

export type SggoiTransitionContext = {
  scrollOffset: { x: number; y: number };
};

export type SggoiTransition = Transition<SggoiTransitionContext>;

export type SsgoiConfig = {
  transitions: {
    from: string;
    to: string;
    transition: SggoiTransition;
    symmetric?: boolean;
  }[];
  defaultTransition?: SggoiTransition;
};

export type SsgoiContext = (
  path: string
) => Transition & { key: TransitionKey };
