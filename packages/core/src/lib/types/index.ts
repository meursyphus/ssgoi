import type { Animation } from "../animation/animation";

/* ────────────────────────────────────────────────────────────────────────────
 * Style / Style objects
 * ──────────────────────────────────────────────────────────────────────────── */

import type { StyleObject } from "../runtime/motion-state";
export type { StyleObject } from "../runtime/motion-state";

/* ────────────────────────────────────────────────────────────────────────────
 * Physics configuration
 * ──────────────────────────────────────────────────────────────────────────── */

export type {
  DoubleSpringFollowerConfig,
  SpringConfig,
  ResistanceType,
  InertiaConfig,
  IntegratorFactory,
  PhysicsOptions,
} from "../runtime/physics";

/* ────────────────────────────────────────────────────────────────────────────
 * Animation state — motion matching domain
 *
 * Pose      — snapshot of one element at a moment (game-anim "pose")
 * Timeline  — full simulation data for one element (frame array)
 * ──────────────────────────────────────────────────────────────────────────── */

/** Existing web imports default to DOM targets; the runtime types require an explicit target. */
export type Pose<TTarget = HTMLElement> =
  import("../runtime/motion-state").Pose<TTarget>;
export type TimelineFrame<TStyle = StyleObject> =
  import("../runtime/motion-state").TimelineFrame<TStyle>;
export type Timeline<
  TTarget = HTMLElement,
  TStyle = StyleObject,
> = import("../runtime/motion-state").Timeline<TTarget, TStyle>;

/* ────────────────────────────────────────────────────────────────────────────
 * Transition context (passed to prepare + animation factory)
 * ──────────────────────────────────────────────────────────────────────────── */

export type ScrollOffset = { x: number; y: number };
export type ScrollPosition = { x: number; y: number };
import type { NavigationDirection } from "../runtime/types";
export type { NavigationDirection } from "../runtime/types";

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

export type {
  PathPatterns,
  PreserveScrollConfig,
  TransitionsResolverArgs,
} from "../runtime/types";
export type SsgoiOnTransitionRule =
  import("../runtime/types").OnRouteRule<AnyTransitionConfig>;
export type SsgoiPairTransitionRule =
  import("../runtime/types").PairRouteRule<AnyTransitionConfig>;
export type SsgoiOrderedTransitionRule =
  import("../runtime/types").OrderedRouteRule<AnyTransitionConfig>;
export type SsgoiTransitionRule =
  import("../runtime/types").RouteRule<AnyTransitionConfig>;
export type SsgoiTransitionsFn =
  import("../runtime/types").TransitionsFn<AnyTransitionConfig>;
export type SsgoiTransitionsOption =
  import("../runtime/types").TransitionsOption<AnyTransitionConfig>;
export type SsgoiConfig =
  import("../runtime/types").RouteConfig<AnyTransitionConfig>;

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
