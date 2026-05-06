import type { Integrator } from "../animation/integrator";

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
  /**
   * Position threshold for settling detection
   * When distance to target is below this, position is considered settled
   * @default 0.01
   */
  restDelta?: number;
  /**
   * Velocity threshold for settling detection
   * When speed is below this, velocity is considered settled
   * @default 0.01
   */
  restSpeed?: number;
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
  /**
   * Minimum boundary value
   * When position goes below this, spring bounce is applied
   */
  min?: number;
  /**
   * Maximum boundary value
   * When position goes above this, spring bounce is applied
   */
  max?: number;
  /**
   * Spring stiffness for boundary bounce effect
   * Higher value = stiffer bounce
   * @default 500
   */
  bounceStiffness?: number;
  /**
   * Spring damping for boundary bounce effect
   * Higher value = faster settling
   * @default 10
   */
  bounceDamping?: number;
  /**
   * Position threshold for settling detection
   * When distance to target is below this, position is considered settled
   * @default 0.01
   */
  restDelta?: number;
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
  prepare?: () => void;

  // Wait before starting the animation
  wait?: () => Promise<void>;

  // Called when animation is ready (before waitPaint, before onStart)
  // Use this for synchronous setup like visibility restoration
  onReady?: () => void;

  // Called when animation starts (after waitPaint)
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
 * Common fields shared by every AnimationItem variant
 */
type AnimationItemBase = {
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
 * Spring-driven animation item — physics drives a tick or css generator
 */
export type SpringAnimationItem = AnimationItemBase & {
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
   */
  css?:
    | ((progress: number) => StyleObject)
    | { element: HTMLElement; style: (progress: number) => StyleObject };

  /** keyframes mode is mutually exclusive with physics/tick/css */
  keyframes?: never;
};

/**
 * Pre-baked keyframes animation item — bypasses physics simulation
 *
 * Plays a pre-built `Keyframe[]` directly via Web Animation API. Use this when
 * you've already composed the desired motion as keyframes (e.g. multiple springs
 * baked into a single timeline) and want the animation to run entirely on the
 * compositor with zero per-frame JS.
 */
export type KeyframesAnimationItem = AnimationItemBase & {
  keyframes: {
    /** Element to animate */
    element: HTMLElement;
    /** WAAPI keyframe array (offsets 0..1) */
    frames: Keyframe[];
    /** Total animation duration in ms */
    duration: number;
    /** WAAPI easing string (default: "linear") */
    easing?: string;
  };

  /** physics/tick/css are not used in keyframes mode */
  physics?: never;
  tick?: never;
  css?: never;
};

/**
 * Individual animation item in a multi-animation config
 *
 * Three mutually-exclusive modes:
 * - tick: RAF-based animation with callback on each frame
 * - css: Web Animation API, generated from spring physics
 * - keyframes: Web Animation API, played from pre-baked Keyframe[]
 */
export type AnimationItem = SpringAnimationItem | KeyframesAnimationItem;

/**
 * Multi-animation configuration
 * Used for complex transitions with multiple coordinated animations
 */
export type MultiAnimationConfig = BaseTransitionConfig & {
  // Array of animations to coordinate
  items: AnimationItem[];

  // How to schedule multiple animations (default: 'parallel')
  schedule?: ScheduleType;

  // Called after each animation completes with progress count
  onProgress?: (completed: number, total: number) => void;
};

/**
 * Transition configuration - supports both single and multi animations
 * Uses Union Type for type safety and backward compatibility
 */
export type TransitionConfig = SingleSpringConfig | MultiAnimationConfig;

/**
 * Type guard to check if config is single animation
 */
export function isSingleAnimation(
  config: TransitionConfig,
): config is SingleSpringConfig {
  return ("tick" in config || "css" in config) && !("items" in config);
}

/**
 * Type guard to check if config is multi-animation
 */
export function isMultiAnimation(
  config: TransitionConfig,
): config is MultiAnimationConfig {
  return "items" in config;
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
 * Type guard to check if an AnimationItem uses pre-baked keyframes mode
 */
export function isKeyframesAnimation(
  item: AnimationItem,
): item is KeyframesAnimationItem {
  return (
    "keyframes" in item &&
    item.keyframes !== undefined &&
    item.keyframes !== null
  );
}

/**
 * Normalize TransitionConfig to MultiAnimationConfig
 * Converts SingleSpringConfig to MultiAnimationConfig with single animation item
 * Accepts both sync config and Promise<TransitionConfig>
 * @internal
 */
export async function normalizeToMultiAnimation(
  config: TransitionConfig | Promise<TransitionConfig>,
): Promise<MultiAnimationConfig> {
  const resolvedConfig = await config;

  if (isMultiAnimation(resolvedConfig)) {
    return {
      prepare: resolvedConfig.prepare,
      wait: resolvedConfig.wait,
      onReady: resolvedConfig.onReady,
      onStart: resolvedConfig.onStart,
      onEnd: resolvedConfig.onEnd,
      items: resolvedConfig.items,
      schedule: resolvedConfig.schedule,
    };
  }

  // Convert SingleSpringConfig to MultiAnimationConfig
  return {
    prepare: resolvedConfig.prepare,
    wait: resolvedConfig.wait,
    onReady: resolvedConfig.onReady,
    onStart: resolvedConfig.onStart,
    onEnd: resolvedConfig.onEnd,
    items: [
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

export type SsgoiTransitionConfig = {
  from: string;
  to: string;
  transition: SggoiTransition;
  symmetric?: boolean;
};

export type SsgoiTransitionConfigInput =
  | SsgoiTransitionConfig
  | readonly SsgoiTransitionConfigInput[];

export type SsgoiConfig = {
  transitions?: readonly SsgoiTransitionConfigInput[];
  defaultTransition?: SggoiTransition;
  middleware?: (from: string, to: string) => { from: string; to: string };
  /**
   * Automatically preserve and restore scroll position when navigating between pages.
   *
   * - `false`: scroll positions are tracked only for the OUT transition diff,
   *   then evicted — SSGOI does not restore scroll on arrival.
   * - `true`: save scroll on leave, restore on return. New (unvisited) paths scroll to 0.
   * - `{ exclude: string[] }`: preserve everywhere except matching paths. Excluded paths
   *   behave like `false` (evict, no restore). Supports wildcards: `/post/*`, `*`.
   * - `(isMobile) => value`: function returning any of the above; evaluated on each
   *   navigation so the answer can vary by environment (e.g. mobile vs. desktop).
   *
   * @default (isMobile) => isMobile  // mobile preserves, desktop does not
   */
  preserveScroll?: PreserveScrollOption;
};

export type PreserveScrollValue = boolean | { exclude: string[] };
export type PreserveScrollFn = (isMobile: boolean) => PreserveScrollValue;
export type PreserveScrollOption = PreserveScrollValue | PreserveScrollFn;

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
 * Normalized animation item for internal use
 * - css is always in object form: { element, style } (spring mode)
 * - keyframes pass through as-is (already normalized — element required)
 * - normalizedOffset is always present
 * @internal
 */
export type NormalizedAnimationItem = {
  onStart?: () => void;
  onComplete?: () => void;
  normalizedOffset: number;
  physics?: PhysicsOptions;
  tick?: (progress: number) => void;
  css?: { element: HTMLElement; style: (progress: number) => StyleObject };
  keyframes?: {
    element: HTMLElement;
    frames: Keyframe[];
    duration: number;
    easing?: string;
  };
};

/**
 * Normalized multi-animation config for internal use
 * Schedule is always normalized to progress-based offsets
 * @internal
 */
export type NormalizedMultiAnimationConfig = Omit<
  MultiAnimationConfig,
  "items" | "schedule"
> & {
  items: NormalizedAnimationItem[];
};

/**
 * Normalize MultiAnimationConfig schedule to progress-based offsets
 *
 * Converts user-facing schedule types to unified offset values:
 * - parallel: All items get offset 0 (start together)
 * - sequential: All items get offset 1 (wait for previous)
 * - stagger: Use each item's custom offset (0-1)
 *
 * Also normalizes css to object form: { element, style }
 *
 * @internal
 */
export function normalizeSchedule(
  config: MultiAnimationConfig,
  element?: HTMLElement,
): NormalizedMultiAnimationConfig {
  const schedule = config.schedule ?? "parallel";

  const normalizedItems: NormalizedAnimationItem[] = config.items.map(
    (item) => {
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
          normalizedOffset = Math.max(0, Math.min(1, item.offset ?? 0));
          break;
        default:
          normalizedOffset = 0;
      }

      // Keyframes items pass through unchanged — they're already self-contained
      // (element baked in, no physics, no css to normalize).
      if (isKeyframesAnimation(item)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { offset: _, ...rest } = item;
        return { ...rest, normalizedOffset };
      }

      // Spring item: normalize css to object form
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { css, offset: _, ...itemRest } = item;
      const normalizedCss = css
        ? typeof css === "function"
          ? element
            ? { element, style: css }
            : undefined
          : { element: css.element, style: css.style }
        : undefined;

      return { ...itemRest, css: normalizedCss, normalizedOffset };
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { schedule: _, ...rest } = config;

  return {
    ...rest,
    items: normalizedItems,
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
