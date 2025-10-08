export type TransitionKey = string | symbol;

export type SpringConfig = {
  stiffness?: number;
  damping?: number;
};

/**
 * Schedule strategy for multi-spring animations
 * - overlap: All springs start immediately (parallel execution)
 * - wait: Each spring waits for previous to complete (sequential)
 * - chain: Springs start with offset delays
 */
export type ScheduleType = "overlap" | "wait" | "chain";

/**
 * Base configuration shared by both single and multi-spring transitions
 */
export type BaseTransitionConfig = {
  // Prepare element before animation (typically for out transitions)
  prepare?: (element: HTMLElement) => void;

  // Wait before starting the animation
  wait?: () => Promise<void>;

  // Called when animation starts
  onStart?: () => void;

  // Called when animation ends
  onEnd?: () => void;
};

/**
 * Single spring configuration (existing - backward compatible)
 * Used for simple transitions with a single animation value
 */
export type SingleSpringConfig<TAnimationValue = number> =
  BaseTransitionConfig & {
    // Spring physics configuration
    spring?: SpringConfig; // Default: { stiffness: 300, damping: 30 }

    // Animation range values
    from?: TAnimationValue; // Default: 0 for in, 1 for out
    to?: TAnimationValue; // Default: 1 for in, 0 for out

    // Callback for each frame with progress value
    tick?: (progress: TAnimationValue) => void;
  };

/**
 * Individual spring item in a multi-spring animation
 */
export type SpringItem<TAnimationValue = number> = {
  from?: TAnimationValue; // Default: 0 for in, 1 for out
  to?: TAnimationValue; // Default: 1 for in, 0 for out
  spring?: SpringConfig;

  /**
   * Frame callback - called on each animation frame with progress value
   *
   * **Performance Warning:** Use WRITE-ONLY operations for best performance.
   * Avoid reading layout properties inside tick to prevent layout thrashing.
   *
   * Layout-triggering properties (causes forced synchronous layout):
   * - element.offsetWidth, offsetHeight, offsetTop, offsetLeft
   * - element.clientWidth, clientHeight
   * - element.getBoundingClientRect()
   * - element.scrollWidth, scrollHeight, scrollTop, scrollLeft
   * - window.getComputedStyle(element)
   *
   * @example
   * // ❌ Bad: Layout read in tick (causes thrashing)
   * tick: (progress) => {
   *   const height = element.offsetHeight  // READ - forces layout!
   *   element.style.height = height * progress
   * }
   *
   * @example
   * // ✅ Good: Read in prepare, write in tick
   * prepare: (element) => {
   *   const height = element.offsetHeight  // READ once before animation
   *   element.dataset.height = height.toString()
   * },
   * tick: (progress) => {
   *   const height = parseFloat(element.dataset.height)
   *   element.style.height = height * progress  // WRITE only
   * }
   */
  tick: (progress: TAnimationValue) => void;

  onStart?: () => void;
  onComplete?: () => void;

  /**
   * Delay offset in milliseconds before this spring starts
   * Only applies to 'chain' schedule mode
   */
  offset?: number;
};

/**
 * Multi-spring configuration (new feature)
 * Used for complex transitions with multiple coordinated animations
 */
export type MultiSpringConfig<TAnimationValue = number> =
  BaseTransitionConfig & {
    // Array of spring animations to coordinate
    springs: SpringItem<TAnimationValue>[];

    // How to schedule multiple springs (default: 'overlap')
    schedule?: ScheduleType;

    // Called after each spring completes with progress count
    onProgress?: (completed: number, total: number) => void;
  };

/**
 * Transition configuration - supports both single and multi-spring animations
 * Uses Union Type for type safety and backward compatibility
 */
export type TransitionConfig<TAnimationValue = number> =
  | SingleSpringConfig<TAnimationValue>
  | MultiSpringConfig<TAnimationValue>;

/**
 * Type guard to check if config is single spring
 */
export function isSingleSpring<T>(
  config: TransitionConfig<T>,
): config is SingleSpringConfig<T> {
  return "tick" in config && !("springs" in config);
}

/**
 * Type guard to check if config is multi-spring
 */
export function isMultiSpring<T>(
  config: TransitionConfig<T>,
): config is MultiSpringConfig<T> {
  return "springs" in config;
}

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
