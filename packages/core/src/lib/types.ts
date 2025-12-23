import type { Integrator } from "./animator/integrator";

export type TransitionKey = string | symbol;

/**
 * Double spring follower configuration
 * Allows customizing the follower spring independently
 */
export type DoubleSpringFollowerConfig = {
  stiffness: number;
  damping: number;
};

export type SpringConfig = {
  stiffness: number;
  damping: number;
  /**
   * Enable double spring for ease-in-out effect (Chained/Lagged Spring)
   *
   * - true: same stiffness for both springs
   * - number (0-1): follower stiffness ratio (smaller = stronger ease-in)
   *   - 1.0: same as true
   *   - 0.5: follower has half stiffness → stronger ease-in
   *   - 0.3: even stronger ease-in
   * - { stiffness, damping }: custom follower spring config
   *
   * Creates a two-spring system:
   * - Leader spring: tracks the target directly
   * - Follower spring: tracks the leader's position (this is the output)
   */
  doubleSpring?: boolean | number | DoubleSpringFollowerConfig;
};

/**
 * Resistance type for inertia physics
 * - linear: resistance proportional to velocity (F = -r * v)
 * - quadratic: resistance proportional to velocity squared (F = -r * v²)
 */
export type ResistanceType = "linear" | "quadratic";

/**
 * Inertia configuration for ease-in effect
 * Simulates acceleration with resistance
 */
export type InertiaConfig = {
  /** Acceleration force (higher = faster acceleration) */
  acceleration: number;
  /** Resistance coefficient (higher = more resistance) */
  resistance: number;
  /** Resistance type (default: 'quadratic') */
  resistanceType?: ResistanceType;
};

/**
 * Custom integrator factory function
 * Allows using custom physics implementations
 */
export type IntegratorFactory = () => Integrator;

/**
 * Physics options for animations
 * Use with & to add physics options to any config type
 *
 * @example
 * type FadeOptions = { from?: number; to?: number } & PhysicsOptions;
 */
export type PhysicsOptions = {
  /** Spring physics (ease-out) */
  spring?: SpringConfig;
  /** Inertia physics (ease-in) */
  inertia?: InertiaConfig;
  /** Custom integrator factory */
  integrator?: IntegratorFactory;
};

/**
 * CSS style object type
 */
export type StyleObject = Record<string, number | string>;

/**
 * Schedule strategy for multi-spring animations (user-facing)
 * - parallel: All springs start immediately (offset = 0)
 * - sequential: Each spring waits for previous to complete (offset = 1)
 * - stagger: Springs start at custom progress offsets (0-1)
 */
export type ScheduleType = "parallel" | "sequential" | "stagger";

/**
 * Base configuration shared by both single and multi-spring transitions
 */
export type BaseTransitionConfig = {
  // Prepare element before animation (typically for out transitions)
  prepare?: (element: HTMLElement) => void;

  /**
   * Update element style to match a specific progress value
   * Called by animator to sync element state (e.g., at animation start or during reversal)
   *
   * @param progress - Progress value (0-1) to apply
   */
  update?: (progress: number) => void;

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
  /**
   * Physics configuration for animation
   * Choose one: spring (ease-out), inertia (ease-in), or custom integrator
   */
  physics?: PhysicsOptions;

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
 *
 * Supports two animation modes (mutually exclusive):
 * - tick: RAF-based animation with callback on each frame
 * - css: Web Animation API with CSS string generation
 */
export type SpringItem = {
  /**
   * Physics configuration for animation
   * Choose one: spring (ease-out), inertia (ease-in), or custom integrator
   */
  physics?: PhysicsOptions;

  /**
   * Frame callback - called on each animation frame with progress value (RAF-based)
   *
   * **Performance Warning:** Use WRITE-ONLY operations for best performance.
   * Avoid reading layout properties inside tick to prevent layout thrashing.
   *
   * @example
   * tick: (progress) => {
   *   element.style.opacity = String(progress)
   * }
   */
  tick?: (progress: number) => void;

  /**
   * Style generator for Web Animation API mode
   *
   * When provided, the animation uses Web Animation API instead of RAF.
   * Spring physics are pre-computed and converted to keyframes.
   *
   * Two forms supported:
   * 1. Function only - uses parent element: `css: (progress) => ({ ... })`
   * 2. Object with element - specifies target element: `css: { element, style: (progress) => ({ ... }) }`
   *
   * @param progress - Current progress value (0 to 1)
   * @returns Style object for Web Animation API
   *
   * @example
   * // Form 1: Function (element from parent)
   * css: (progress) => ({
   *   opacity: progress,
   *   transform: `translateY(${(1 - progress) * 20}px)`,
   * })
   *
   * @example
   * // Form 2: Object with custom element
   * css: {
   *   element: myElement,
   *   style: (progress) => ({
   *     transform: `scale(${progress})`,
   *   }),
   * }
   */
  css?:
    | ((progress: number) => StyleObject)
    | { element: HTMLElement; style: (progress: number) => StyleObject };

  onStart?: () => void;
  onComplete?: () => void;

  /**
   * Progress offset (0-1) before this spring starts
   * - 0: Start immediately (parallel behavior)
   * - 1: Start after previous spring completes (sequential behavior)
   * - 0.5: Start when previous spring is 50% complete
   *
   * Only applies to 'stagger' schedule mode.
   * For 'parallel' mode, all springs start at 0.
   * For 'sequential' mode, all springs use offset 1.
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

  // How to schedule multiple springs (default: 'parallel')
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

/**
 * Validate SpringItem doesn't have both tick and css defined
 * @throws Error if both tick and css are defined
 */
export function validateSpringItem(item: SpringItem): void {
  if (item.tick && item.css) {
    throw new Error(
      "SpringItem cannot have both 'tick' and 'css' defined. Use one or the other.",
    );
  }
}

/**
 * Normalize TransitionConfig to MultiSpringConfig
 * Converts SingleSpringConfig to MultiSpringConfig with single spring item
 * Accepts both sync config and Promise<TransitionConfig>
 * @internal
 */
export async function normalizeToMultiSpring(
  config: TransitionConfig | Promise<TransitionConfig>,
): Promise<MultiSpringConfig> {
  const resolvedConfig = await config;

  if (isMultiSpring(resolvedConfig)) {
    // Validate all spring items
    resolvedConfig.springs.forEach(validateSpringItem);
    return resolvedConfig;
  }

  // Validate single spring config
  validateAnimationMode(resolvedConfig);

  // Convert SingleSpringConfig to MultiSpringConfig
  return {
    prepare: resolvedConfig.prepare,
    update: resolvedConfig.update,
    wait: resolvedConfig.wait,
    onStart: resolvedConfig.onStart,
    onEnd: resolvedConfig.onEnd,
    springs: [
      {
        physics: resolvedConfig.physics,
        tick: resolvedConfig.tick,
        css: resolvedConfig.css,
      },
    ],
    schedule: "parallel",
  };
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

/**
 * Scope behavior for transitions
 * - 'global': Always run animations (default)
 * - 'local': Skip animations when mounting/unmounting with parent TransitionScope
 */
export type TransitionScope = "global" | "local";

export type TransitionOptions<TContext = undefined> = Transition<TContext> & {
  key: TransitionKey;
  /**
   * Controls animation behavior relative to TransitionScope
   * - 'global' (default): Always run IN/OUT animations
   * - 'local': Skip animations when mounting/unmounting simultaneously with scope
   */
  scope?: TransitionScope;
};

export type TransitionCallback = (
  element: HTMLElement | null,
) => void | (() => void);

/**
 * Ref callback type for 'auto' mode
 * Handles null and manages unmount automatically via MutationObserver
 */
export type RefCallback = (element: HTMLElement | null) => void;

/**
 * Transition mode
 * - 'manual': Returns TransitionCallback with cleanup function (default)
 * - 'auto': Returns RefCallback with automatic unmount detection via MutationObserver
 */
export type TransitionMode = "manual" | "auto";

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

/**
 * Internal options for framework adapters
 * Not exposed to end users
 * @internal
 */
export type SsgoiInternalOptions = {
  /**
   * Whether OUT transition must arrive before IN transition
   *
   * - true (default): OUT must arrive first, IN completes the pair.
   *   Best for frameworks with native destroy callbacks (Svelte, Vue).
   *
   * - false: OUT and IN can arrive in any order, both wait indefinitely.
   *   Best for frameworks using MutationObserver for unmount detection (React).
   *
   * @default true
   */
  outFirst?: boolean;
};

export type SsgoiContext = (
  path: string,
) => Transition & { key: TransitionKey };

/**
 * Normalized schedule entry for internal processing
 * All schedule types are normalized to progress-based offsets (0-1)
 *
 * Progress offset determines when each spring starts relative to previous spring:
 * - 0: Start immediately (parallel)
 * - 1: Start after previous completes (sequential)
 * - 0.5: Start when previous is 50% complete
 *
 * @internal
 */
export type NormalizedScheduleEntry = {
  id: string;
  /**
   * Progress offset (0-1) relative to previous spring
   * - 0: Start immediately with previous spring
   * - 1: Start after previous spring completes
   * - 0-1: Start when previous spring reaches this progress
   */
  offset: number;
};

/**
 * Normalized spring item for internal use
 * - css is always in object form: { element, style }
 * - normalizedOffset is always present
 * @internal
 */
export type NormalizedSpringItem = Omit<SpringItem, "css" | "offset"> & {
  css?: { element: HTMLElement; style: (progress: number) => StyleObject };
  normalizedOffset: number;
};

/**
 * Normalized multi-spring config for internal use
 * Schedule is always normalized to progress-based offsets
 * @internal
 */
export type NormalizedMultiSpringConfig = Omit<
  MultiSpringConfig,
  "springs" | "schedule"
> & {
  springs: NormalizedSpringItem[];
};

/**
 * Normalize MultiSpringConfig schedule to progress-based offsets
 *
 * Converts user-facing schedule types to unified offset values:
 * - parallel: All springs get offset 0 (start together)
 * - sequential: All springs get offset 1 (wait for previous)
 * - stagger: Use each spring's custom offset (0-1)
 *
 * Also normalizes css to object form: { element, style }
 *
 * @internal
 */
export function normalizeMultiSpringSchedule(
  config: MultiSpringConfig,
  element?: HTMLElement,
): NormalizedMultiSpringConfig {
  const schedule = config.schedule ?? "parallel";

  const normalizedSprings: NormalizedSpringItem[] = config.springs.map(
    (spring) => {
      let normalizedOffset: number;

      switch (schedule) {
        case "parallel":
          // All start immediately
          normalizedOffset = 0;
          break;
        case "sequential":
          // Each waits for previous to complete
          normalizedOffset = 1;
          break;
        case "stagger":
          // Use custom offset, default to 0
          normalizedOffset = Math.max(0, Math.min(1, spring.offset ?? 0));
          break;
        default:
          normalizedOffset = 0;
      }

      // Normalize css to object form
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { css, offset: _, ...springRest } = spring;
      const normalizedCss = css
        ? typeof css === "function"
          ? element
            ? { element, style: css }
            : undefined
          : { element: css.element, style: css.style }
        : undefined;

      return { ...springRest, css: normalizedCss, normalizedOffset };
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { schedule: _, ...rest } = config;

  return {
    ...rest,
    springs: normalizedSprings,
  };
}

/**
 * Animation state
 * For MultiAnimator: returns first animator's state
 * @internal
 */
export type AnimationState = {
  position: number;
  velocity: number;
  from: number;
  to: number;
};
