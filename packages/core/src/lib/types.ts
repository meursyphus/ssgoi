export type TransitionKey = string | symbol;

export type SpringConfig = {
  stiffness: number;
  damping: number;
};

/**
 * CSS style object type
 */
export type StyleObject = Record<string, number | string>;

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
 * Single spring configuration
 * Used for simple transitions with a single animation value
 *
 * Supports two animation modes:
 * - tick: RAF-based animation with callback on each frame
 * - css: Web Animation API with CSS string generation
 */
export type SingleSpringConfig = BaseTransitionConfig & {
  // Spring physics configuration
  spring?: SpringConfig; // Default: { stiffness: 300, damping: 30 }

  // Callback for each frame with progress value (RAF-based)
  tick?: (progress: number) => void;

  /**
   * Style generator for Web Animation API mode
   *
   * When provided, the animation uses Web Animation API instead of RAF.
   * Spring physics are pre-computed and converted to keyframes.
   *
   * @param progress - Current progress value (0 to 1)
   * @returns Style object for Web Animation API
   *
   * @example
   * ```ts
   * css: (progress) => ({
   *   opacity: progress,
   *   transform: `translateY(${(1 - progress) * 20}px)`,
   * })
   * ```
   */
  css?: (progress: number) => StyleObject;
};

/**
 * Individual spring item in a multi-spring animation
 */
export type SpringItem = {
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
  tick: (progress: number) => void;

  onStart?: () => void;
  onComplete?: () => void;

  /**
   * Delay offset in milliseconds before this spring starts
   * Only applies to 'chain' schedule mode
   */
  offset?: number;
};

/**
 * Multi-spring configuration
 * Used for complex transitions with multiple coordinated animations
 */
export type MultiSpringConfig = BaseTransitionConfig & {
  // Array of spring animations to coordinate
  springs: SpringItem[];

  // How to schedule multiple springs (default: 'overlap')
  schedule?: ScheduleType;

  // Called after each spring completes with progress count
  onProgress?: (completed: number, total: number) => void;
};

/**
 * Transition configuration - supports both single and multi-spring animations
 * Uses Union Type for type safety and backward compatibility
 */
export type TransitionConfig = SingleSpringConfig | MultiSpringConfig;

/**
 * Type guard to check if config is single spring
 */
export function isSingleSpring(
  config: TransitionConfig,
): config is SingleSpringConfig {
  return ("tick" in config || "css" in config) && !("springs" in config);
}

/**
 * Type guard to check if config is multi-spring
 */
export function isMultiSpring(
  config: TransitionConfig,
): config is MultiSpringConfig {
  return "springs" in config;
}

/**
 * Type guard to check if config uses CSS mode (Web Animation API)
 */
export function isCssAnimation(
  config: SingleSpringConfig,
): config is SingleSpringConfig & { css: (progress: number) => string } {
  return "css" in config && typeof config.css === "function";
}

/**
 * Type guard to check if config uses tick mode (RAF-based)
 */
export function isTickAnimation(
  config: SingleSpringConfig,
): config is SingleSpringConfig & { tick: (progress: number) => void } {
  return "tick" in config && typeof config.tick === "function";
}

/**
 * Validate that config doesn't have both tick and css defined
 * @throws Error if both tick and css are defined
 */
export function validateAnimationMode(config: SingleSpringConfig): void {
  if (isCssAnimation(config) && isTickAnimation(config)) {
    throw new Error(
      "SingleSpringConfig cannot have both 'tick' and 'css' defined. Use one or the other.",
    );
  }
}

export type GetTransitionConfig<TContext = undefined> =
  TContext extends undefined
    ? (node: HTMLElement) => TransitionConfig | Promise<TransitionConfig>
    : (
        node: HTMLElement,
        context: TContext,
      ) => TransitionConfig | Promise<TransitionConfig>;

export type Transition<TContext = undefined> = {
  in?: GetTransitionConfig<TContext>;
  out?: GetTransitionConfig<TContext>;
  key?: TransitionKey;
};

export type TransitionOptions<TContext = undefined> = Transition<TContext> & {
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
  /**
   * Skip page transitions when iOS/Safari swipe-back gesture is detected
   * This prevents animation conflicts between SSGOI and Safari's native swipe animation
   * @default true
   */
  skipOnIosSwipe?: boolean;
};

export type SsgoiContext = (
  path: string,
) => Transition & { key: TransitionKey };

/**
 * Normalized schedule entry for internal processing (discriminated union)
 * Used by AnimationScheduler to unify different schedule strategies
 * @internal
 */
export type NormalizedScheduleEntry = OffsetScheduleEntry | WaitScheduleEntry;

/**
 * Offset-based schedule entry (overlap/chain modes)
 * - delay=0: immediate start (overlap)
 * - delay>0: delayed start with fixed timing (chain)
 * @internal
 */
export type OffsetScheduleEntry = {
  type: "offset";
  id: string;
  delay: number; // milliseconds
};

/**
 * Wait-based schedule entry (wait mode)
 * Dynamic dependency - starts after previous spring completes
 * @internal
 */
export type WaitScheduleEntry = {
  type: "wait";
  id: string;
};

/**
 * Animation state (discriminated union)
 * Different return types for single vs multi-spring animations
 * @internal
 */
export type AnimationState = SingleAnimationState | MultiAnimationState;

/**
 * Single spring animation state
 * @internal
 */
export type SingleAnimationState = {
  type: "single";
  position: number;
  velocity: number;
  from: number;
  to: number;
};

/**
 * Multi-spring animation state
 * Always uses number for progress tracking
 * @internal
 */
export type MultiAnimationState = {
  type: "multi";
  completed: number;
  total: number;
  direction: "forward" | "backward";
};

/**
 * Common interface for animation controllers
 * Implemented by both Animator (single spring) and AnimationScheduler (multi-spring)
 * @internal
 */
export interface AnimationController {
  forward(): void;
  backward(): void;
  stop(): void;
  reverse(): void;
  getCurrentState(): AnimationState;
}
