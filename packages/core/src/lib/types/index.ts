import type { Integrator } from "../animation/integrator";
import type { Animation } from "../animation/animation";

/* ────────────────────────────────────────────────────────────────────────────
 * Style / Style objects
 * ──────────────────────────────────────────────────────────────────────────── */

export type StyleObject = Record<string, number | string>;

/* ────────────────────────────────────────────────────────────────────────────
 * Physics configuration
 * ──────────────────────────────────────────────────────────────────────────── */

export type DoubleSpringFollowerConfig = {
  stiffness: number;
  damping: number;
};

export type SpringConfig = {
  stiffness: number;
  damping: number;
  doubleSpring?: boolean | number | DoubleSpringFollowerConfig;
  restDelta?: number;
  restSpeed?: number;
};

export type ResistanceType = "linear" | "quadratic";

export type InertiaConfig = {
  acceleration: number;
  resistance: number;
  resistanceType?: ResistanceType;
  min?: number;
  max?: number;
  bounceStiffness?: number;
  bounceDamping?: number;
  restDelta?: number;
};

export type IntegratorFactory = () => Integrator;

export type PhysicsOptions = {
  spring?: SpringConfig;
  inertia?: InertiaConfig;
  integrator?: IntegratorFactory;
};

/* ────────────────────────────────────────────────────────────────────────────
 * Animation state — motion matching domain
 *
 * Pose      — snapshot of one element at a moment (game-anim "pose")
 * Timeline  — full simulation data for one element (frame array)
 * ──────────────────────────────────────────────────────────────────────────── */

export type Pose = {
  /** Identity for motion matching — same DOM node across animations means
   * the same pose. */
  element: HTMLElement;
  value: number;
  velocity: number;
};

export type TimelineFrame = {
  time: number;
  value: number;
  velocity: number;
  style?: StyleObject;
};

export type Timeline = {
  element: HTMLElement;
  frames: TimelineFrame[];
};

/* ────────────────────────────────────────────────────────────────────────────
 * Transition context (passed to prepare + animation factory)
 * ──────────────────────────────────────────────────────────────────────────── */

export type ScrollOffset = { x: number; y: number };
export type ScrollPosition = { x: number; y: number };
export type NavigationDirection = "forward" | "backward";

/**
 * Context provided by the dispatcher to a transition.
 *
 * Has `from`/`to` views split so a transition can read each side independently
 * — `from.scroll` is the outgoing page's scroll, `to.scroll` the incoming page.
 */
export type SsgoiTransitionContext = {
  /**
   * Semantic navigation direction resolved from the route rule. Transitions
   * map this to their own visual vocabulary (enter/exit, left/right, up/down).
   */
  readonly direction: NavigationDirection;
  scrollOffset: ScrollOffset;
  from: {
    scroll: ScrollPosition;
  };
  to: {
    scroll: ScrollPosition;
  };
  scrollingElement: HTMLElement;
  positionedParent: HTMLElement;
};

/* ────────────────────────────────────────────────────────────────────────────
 * Transition config — new shape
 *
 * A preset (fade, slide, hero, ...) returns this. The dispatcher invokes
 * `prepare` (with both from/to promises) then `animation` (with resolved values
 * + prepare extras) to obtain a runnable Animation.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface CreateElement {
  <K extends keyof HTMLElementTagNameMap>(
    id: string,
    tag: K,
  ): HTMLElementTagNameMap[K];
  (id: string): HTMLDivElement;
}

export type PrepareArgs = {
  from: Promise<HTMLElement>;
  to: Promise<HTMLElement>;
  context: SsgoiTransitionContext;
  createElement: CreateElement;
};

export type AnimationFactoryArgs<TExtras> = {
  from: HTMLElement;
  to: HTMLElement;
  context: SsgoiTransitionContext;
} & TExtras;

/**
 * Helper to author transitions with full type inference: TS reads the return
 * shape of `prepare` and feeds it back into `animation`'s argument type, so
 * you never need to write the extras type explicitly.
 *
 * @example
 * export const myTransition = () => defineTransition({
 *   prepare: ({ to, createElement }) => {
 *     const overlay = createElement("overlay");
 *     return { overlay };
 *   },
 *   animation: ({ from, to, overlay }) => { // overlay typed as HTMLDivElement
 *     return new MultiAnimation([...]);
 *   },
 * });
 */
export function defineTransition<TExtras extends object>(
  config: TransitionConfig<TExtras>,
): TransitionConfig<TExtras> {
  return config;
}

export type TransitionConfig<TExtras extends object = object> = {
  /**
   * Synchronous setup that returns extras (or a Promise of them).
   *
   * Runs as soon as the path-pair is matched; receives `from`/`to` as
   * Promises so each side can be styled the moment it arrives — typically
   * via `from.then(el => …)` for pre-paint hints. Don't `await` from/to
   * inside an async prepare just to do per-side setup; doing so serialises
   * what should be parallel.
   *
   * The dispatcher does not synchronously await anything: prepare's return
   * (Promise or value), `from`, and `to` are all `.then`-chained in parallel
   * and `animation` runs once all three resolve.
   */
  prepare?: (args: PrepareArgs) => TExtras | Promise<TExtras>;
  animation: (args: AnimationFactoryArgs<TExtras>) => Animation;
};

/**
 * Erased-extras form used at path config storage boundaries. The dispatcher
 * passes whatever prepare returned to animation verbatim, so we can treat the
 * extras as opaque here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTransitionConfig = TransitionConfig<any>;

/* ────────────────────────────────────────────────────────────────────────────
 * Route rules (Ssgoi top-level)
 * ──────────────────────────────────────────────────────────────────────────── */

export type PathPatterns = string | readonly string[];

type SsgoiTransitionRuleBase = {
  transition: AnyTransitionConfig;
  /**
   * Higher values win before path specificity. Defaults to 0.
   * Useful for an exceptional effect declared below a broad fallback.
   */
  priority?: number;
};

/**
 * A route-family rule. Entering the family is forward, leaving it is
 * backward, and navigation within it uses semantic history/pop detection.
 */
export type SsgoiOnTransitionRule = SsgoiTransitionRuleBase & {
  on: PathPatterns;
  except?: PathPatterns;
  from?: never;
  to?: never;
  ordered?: never;
  bidirectional?: never;
};

/**
 * A precise relationship between two route families. The normal from → to
 * orientation is forward; the reverse is backward when bidirectional
 * (the default).
 */
export type SsgoiPairTransitionRule = SsgoiTransitionRuleBase & {
  from: PathPatterns;
  to: PathPatterns;
  bidirectional?: boolean;
  on?: never;
  except?: never;
  ordered?: never;
};

/**
 * An ordered set of routes. Both endpoints must match the set; increasing
 * index is forward and decreasing index is backward.
 */
export type SsgoiOrderedTransitionRule = SsgoiTransitionRuleBase & {
  ordered: readonly string[];
  on?: never;
  except?: never;
  from?: never;
  to?: never;
  bidirectional?: never;
};

export type SsgoiTransitionRule =
  | SsgoiOnTransitionRule
  | SsgoiPairTransitionRule
  | SsgoiOrderedTransitionRule;

export type PreserveScrollValue =
  | boolean
  | { exclude: string[]; key?: string }
  | { key: string; exclude?: string[] };
export type PreserveScrollFn = (isMobile: boolean) => PreserveScrollValue;
export type PreserveScrollOption = PreserveScrollValue | PreserveScrollFn;

/**
 * Argument handed to a functional `transitions` config. Destructured at the
 * call site (`({ isMobile }) => …`) so the boolean's meaning is self-documenting
 * — and so the object can grow more fields later without breaking signatures.
 */
export type TransitionsResolverArgs = { isMobile: boolean };

/**
 * Functional form of `transitions`: receives device context and returns the
 * path-transition list. Lets a config branch on viewport (e.g. drawer on
 * mobile, fade on desktop) without an outer wrapper.
 */
export type SsgoiTransitionsFn = (
  args: TransitionsResolverArgs,
) => readonly SsgoiTransitionRule[];

/**
 * `transitions` accepts either a flat rule list or a function of device
 * context. Both normalize to the functional form internally.
 */
export type SsgoiTransitionsOption =
  | readonly SsgoiTransitionRule[]
  | SsgoiTransitionsFn;

export type SsgoiConfig = {
  transitions?: SsgoiTransitionsOption;
  middleware?: (from: string, to: string) => { from: string; to: string };
  preserveScroll?: PreserveScrollOption;
};

/* ────────────────────────────────────────────────────────────────────────────
 * Dispatcher output — what the framework adapter consumes
 *
 * The adapter notifies the context of an element mount (`in`) or unmount
 * (`out`). The context pairs them up by path and runs the matched transition.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Adapter-facing API surface exposed by `createSsgoiTransitionContext`.
 *
 * Wrapped in an object so we can add fields later (e.g. status getters,
 * cancellation helpers) without breaking call sites that destructure.
 */
export type SsgoiContext = {
  /**
   * Tell the dispatcher this DOM node has mounted under `path`. The
   * dispatcher handles pairing with the outgoing page, running the matched
   * transition, and watching for removal via a shared MutationObserver.
   * Idempotent per element — repeat calls with the same node are no-ops.
   */
  register: (
    path: string,
    element: HTMLElement,
    options?: {
      /**
       * Whether this registration represents an entering transition boundary.
       *
       * Nested boundaries discovered inside a newly-mounted parent boundary
       * are registered with `enter: false`: they must be watched for future
       * child-route changes, but the parent owns the current IN event.
       */
      enter?: boolean;
    },
  ) => void;

  /**
   * Returns a path-bound ref callback. Stable across calls for the same
   * `path` so framework adapters can drop it straight into `ref={…}` without
   * `useCallback`/`useMemo`.
   */
  refFor: (path: string) => (element: HTMLElement | null) => void;
};
