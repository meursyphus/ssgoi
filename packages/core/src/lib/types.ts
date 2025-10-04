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

  // Wait before starting the animation
  wait?: () => Promise<void>;

  // Called when animation starts
  onStart?: () => void;

  // Called when animation ends
  onEnd?: () => void;
};

export type GetTransitionConfig<
  TContext = undefined,
  TAnimationValue = number,
> = TContext extends undefined
  ? (
      node: HTMLElement,
    ) =>
      | TransitionConfig<TAnimationValue>
      | Promise<TransitionConfig<TAnimationValue>>
  : (
      node: HTMLElement,
      context: TContext,
    ) =>
      | TransitionConfig<TAnimationValue>
      | Promise<TransitionConfig<TAnimationValue>>;

export type Transition<TContext = undefined, TAnimationValue = number> = {
  in?: GetTransitionConfig<TContext, TAnimationValue>;
  out?: GetTransitionConfig<TContext, TAnimationValue>;
  key?: TransitionKey;
};

export type TransitionOptions<
  TContext = undefined,
  TAnimationValue = number,
> = Transition<TContext, TAnimationValue> & {
  key?: TransitionKey;
  ref?: object;
};

export type TransitionCallback = (
  element: HTMLElement | null,
) => void | (() => void);

/**
 * Context object passed to view transitions
 * Provides essential information for smooth page transitions
 */
export type SggoiTransitionContext = {
  /**
   * The scroll position difference between 'from' and 'to' pages
   * Used in hero and pinterest transitions to maintain natural scroll position
   * when transitioning between pages with different scroll states
   */
  scrollOffset: { x: number; y: number };

  /**
   * The current page's scroll position
   * Provides the actual scroll coordinates for precise viewport calculations
   * OUT transition receives 'from' page scroll, IN transition receives 'to' page scroll
   */
  scroll: { x: number; y: number };

  /**
   * The scrollable container element (document.documentElement or custom container)
   * Provides viewport dimensions for calculating transition animations
   * Lazy-evaluated to handle delayed initialization
   */
  scrollingElement: HTMLElement;

  /**
   * The positioned parent element (containing block for absolute positioning)
   * Returns the nearest ancestor with position: relative/absolute/fixed/sticky
   * Falls back to document.body if no positioned ancestor exists
   * Lazy-evaluated to handle delayed initialization
   */
  positionedParent: HTMLElement;

  /**
   * The trigger element (element that triggered the transition)
   * Lazy-evaluated to handle delayed initialization
   */
  triggerElement: HTMLElement | null;
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
  path: string,
) => Transition & { key: TransitionKey };
