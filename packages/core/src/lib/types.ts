export type TransitionKey = string | symbol;

export type SpringConfig = {
  stiffness?: number;
  damping?: number;
};

export type TransitionConfig<TAnimationValue = number> = {
  // Spring physics configuration
  spring?: SpringConfig; // Default: { stiffness: 300, damping: 30 }

  // Animation range values
  from?: TAnimationValue; // Default: 0 for in, 1 for out
  to?: TAnimationValue; // Default: 1 for in, 0 for out

  // Callback for each frame with progress value
  tick?: (progress: TAnimationValue) => void;

  // Prepare element before animation (typically for out transitions)
  prepare?: (element: HTMLElement) => void;

  // Called when animation starts
  onStart?: () => void;

  // Called when animation ends
  onEnd?: () => void;
};

export type GetTransitionConfig<TContext = undefined, TAnimationValue = number> =
  TContext extends undefined
    ? (node: HTMLElement) => TransitionConfig<TAnimationValue> | Promise<TransitionConfig<TAnimationValue>>
    : (
        node: HTMLElement,
        context: TContext
      ) => TransitionConfig<TAnimationValue> | Promise<TransitionConfig<TAnimationValue>>;

export type Transition<TContext = undefined, TAnimationValue = number> = {
  in?: GetTransitionConfig<TContext, TAnimationValue>;
  out?: GetTransitionConfig<TContext, TAnimationValue>;
};

export type TransitionCallback = (
  element: HTMLElement | null
) => void | (() => void);

export type SggoiTransitionContext = {
  scrollOffset: { x: number; y: number };
};

export type SggoiTransition = Transition<SggoiTransitionContext>;

export type SsgoiConfig = {
  transitions?: {
    from: string;
    to: string;
    transition: SggoiTransition;
    symmetric?: boolean;
  }[];
  defaultTransition?: SggoiTransition;
  middleware?: (from: string, to: string) => { from: string; to: string };
};

export type SsgoiContext = (
  path: string
) => Transition & { key: TransitionKey };
