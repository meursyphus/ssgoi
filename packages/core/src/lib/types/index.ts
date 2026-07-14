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

/**
 * Context provided by the dispatcher to a transition.
 *
 * Has `from`/`to` views split so a transition can read each side independently
 * — `from.scroll` is the outgoing page's scroll, `to.scroll` the incoming page.
 */
export type SsgoiTransitionContext = {
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
 * Path-matched config (Ssgoi top-level)
 * ──────────────────────────────────────────────────────────────────────────── */

export type SsgoiPathTransition = {
  from: string;
  to: string;
  transition: AnyTransitionConfig;
  symmetric?: boolean;
};

/**
 * A transition selected by an app-supplied direction token rather than by the
 * `(from, to)` path pair. The token is whatever `SsgoiConfig.resolveDirection`
 * returns (e.g. `"forward"` / `"back"`); a resolved token that matches a
 * registered entry's `direction` selects it with strict precedence over path
 * matching. Has no `from`/`to`/`symmetric` — all path/direction conditionality
 * lives in the resolver, which already receives the paths.
 */
export type SsgoiDirectionTransition = {
  direction: string;
  transition: AnyTransitionConfig;
};

/**
 * A single entry in the `transitions` list: either a path-pair entry (the
 * existing form, matched by `findMatchingTransition`) or a direction entry (new,
 * selected by a resolved token). Runtime selection recognizes the existing
 * required `from`/`to` fields first so extra application metadata cannot
 * reclassify a path entry.
 */
export type SsgoiTransitionEntry =
  | SsgoiPathTransition
  | SsgoiDirectionTransition;

export type SsgoiTransitionInput =
  | SsgoiTransitionEntry
  | readonly SsgoiTransitionInput[];

/**
 * @deprecated Use `SsgoiTransitionInput`. Direction entries are now accepted,
 * so the old path-specific name no longer describes the full input shape.
 */
export type SsgoiPathTransitionInput = SsgoiTransitionInput;

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
 * transition list. Lets a config branch on viewport (e.g. drawer on mobile,
 * fade on desktop) without an outer wrapper.
 */
export type SsgoiTransitionsFn = (
  args: TransitionsResolverArgs,
) => readonly SsgoiTransitionInput[];

/**
 * `transitions` accepts either the plain list (existing form) or a function of
 * device context. Both normalize to the functional form internally.
 */
export type SsgoiTransitionsOption =
  | readonly SsgoiTransitionInput[]
  | SsgoiTransitionsFn;

/**
 * Classifies a real transition into an app-defined direction token. Receives
 * the ORIGINAL navigated paths (before `middleware`) and returns a token —
 * typically computed from state the app owns (history-stack traversal, a
 * nav-intent store, a gesture). A returned token that matches a registered
 * `{ direction }` entry selects it; `null`/`undefined` falls through to normal
 * path-pair matching. Never invoked for the `(path, path)` scroll-normalization
 * calls — it is wired only at the real-transition site.
 */
export type ResolveDirection = (args: {
  from: string;
  to: string;
}) => string | null | undefined;

export type SsgoiConfig = {
  transitions?: SsgoiTransitionsOption;
  middleware?: (from: string, to: string) => { from: string; to: string };
  preserveScroll?: PreserveScrollOption;
  /**
   * Optional direction classifier. When it returns a token registered as a
   * `{ direction }` entry in `transitions`, that entry wins over path matching;
   * otherwise selection falls through to `findMatchingTransition`. Lets the
   * SAME path pair animate differently depending on how the user navigated
   * (e.g. history-back reverses) — the concern `middleware` cannot express
   * without corrupting scroll identity. Omitting it is a no-op: behavior is
   * byte-for-byte the path-only path.
   */
  resolveDirection?: ResolveDirection;
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
  register: (path: string, element: HTMLElement) => void;

  /**
   * Returns a path-bound ref callback. Stable across calls for the same
   * `path` so framework adapters can drop it straight into `ref={…}` without
   * `useCallback`/`useMemo`.
   */
  refFor: (path: string) => (element: HTMLElement | null) => void;
};
