export type TransitionKey = string | symbol;

export type SpringConfig = {
  stiffness?: number;
  damping?: number;
};

export type TransitionConfig<T = number> = {
  // Spring physics configuration
  spring?: SpringConfig; // Default: { stiffness: 300, damping: 30 }

  // Animation range values
  from?: T; // Default: 0 for in, 1 for out
  to?: T; // Default: 1 for in, 0 for out

  // Callback for each frame with progress value
  tick?: (progress: T) => void;

  // Prepare element before animation (typically for out transitions)
  prepare?: (element: HTMLElement) => void;

  // Called when animation starts
  onStart?: () => void;

  // Called when animation ends
  onEnd?: () => void;
};

export type GetTransitionConfig<TContext = undefined, T = number> =
  TContext extends undefined
    ? (node: HTMLElement) => TransitionConfig<T> | Promise<TransitionConfig<T>>
    : (
        node: HTMLElement,
        context: TContext
      ) => TransitionConfig<T> | Promise<TransitionConfig<T>>;

export type Transition<TContext = undefined, T = number> = {
  in?: GetTransitionConfig<TContext, T>;
  out?: GetTransitionConfig<TContext, T>;
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
