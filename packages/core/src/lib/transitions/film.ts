import type {
  MultiAnimationConfig,
  PhysicsOptions,
  SggoiTransition,
  SggoiTransitionContext,
  SpringConfig,
} from "@types";

import { SETTLE_THRESHOLD, SpringIntegrator } from "../animation/integrator";
import { getRect } from "@utils";
import { prepareOutgoing } from "@utils";

// Default spring configurations for each animation phase
const DEFAULT_SPRINGS = {
  scaleDown: { stiffness: 20, damping: 7 } as SpringConfig, // Soft start for cinematic scale
  translate: { stiffness: 15, damping: 7 } as SpringConfig, // Medium for movement
  scaleUp: { stiffness: 20, damping: 7 } as SpringConfig, // Crisp return to full size
};

// Stagger offsets — when each spring starts relative to the *previous* spring's
// progress (0..1). 0.2 = "start when previous spring is 20% of the way to its
// target". Values match the prior tick-based implementation exactly.
const OFFSETS = {
  scaleDown: 0,
  translate: 0.2,
  scaleUp: 0.8,
};

const DEFAULT_SCALE = 0.8;
const DEFAULT_BORDER_COLOR = "white";

const FRAME_MS = 1000 / 60;
const MAX_FRAMES = 600; // 10s safety cap, mirrors css-runner

interface FilmOptions {
  border?: {
    color?: string;
  };
  physics?: PhysicsOptions;
}

/**
 * One spring inside a baked stagger schedule. Mirrors a tick-mode
 * AnimationItem (physics + tick callback + offset).
 */
interface BakedSpringItem {
  spring: SpringConfig;
  /** Stagger offset 0..1 — start when previous spring reaches this progress. */
  offset: number;
  /**
   * Called once per frame the spring is active, after its integrator step.
   * Mirrors AnimationItem.tick exactly: receives the integrator's position
   * (which moves from `from` to `to`).
   */
  tick: (position: number) => void;
}

/**
 * Run a stagger schedule of springs offline, frame by frame, exactly the way
 * MultiAnimator would run them live: each frame, items tick *in array order*
 * (later items overwrite shared state written by earlier items), and items
 * with stagger offsets start when the previous item's progress crosses their
 * threshold.
 *
 * After each frame's ticks complete, `recordFrame(time)` is called so the
 * caller can snapshot whatever shared state the ticks wrote to.
 *
 * Returns the wall-clock time at which the last spring settled, suitable for
 * use as the WAAPI animation's `duration`.
 */
function bakeStaggerSchedule(opts: {
  items: BakedSpringItem[];
  from: number;
  to: number;
  recordFrame: (time: number) => void;
}): number {
  const { items, from, to, recordFrame } = opts;
  const dt = FRAME_MS / 1000;
  const range = Math.abs(to - from);

  type SpringRuntime = {
    item: BakedSpringItem;
    integrator: SpringIntegrator;
    state: { position: number; velocity: number };
    started: boolean;
    settled: boolean;
    settleTime: number;
  };

  const springs: SpringRuntime[] = items.map((item) => ({
    item,
    integrator: new SpringIntegrator({
      stiffness: item.spring.stiffness,
      damping: item.spring.damping,
    }),
    state: { position: from, velocity: 0 },
    started: false,
    settled: false,
    settleTime: 0,
  }));

  // First spring (or any with offset 0) starts immediately on frame 0.
  for (let i = 0; i < springs.length; i++) {
    if (i === 0 || springs[i]!.item.offset === 0) {
      springs[i]!.started = true;
    }
  }

  // Frame -1 snapshot — captures the initial state (before any ticks).
  recordFrame(0);

  let lastFrameTime = 0;
  for (let frame = 1; frame <= MAX_FRAMES; frame++) {
    const time = frame * FRAME_MS;
    lastFrameTime = time;

    // Step + tick each spring in items order. Order matters: later ticks
    // overwrite shared state written by earlier ticks (matching the live
    // multi-animator's RAF subscriber order).
    for (const sp of springs) {
      if (!sp.started || sp.settled) continue;

      sp.state = sp.integrator.step(sp.state, to, dt);

      if (sp.integrator.isSettled(sp.state, to)) {
        sp.settleTime += dt;
        if (sp.settleTime >= SETTLE_THRESHOLD) {
          sp.state = { position: to, velocity: 0 };
          sp.settled = true;
        }
      } else {
        sp.settleTime = 0;
      }

      sp.item.tick(sp.state.position);
    }

    // After this frame's ticks, check whether the next un-started spring's
    // stagger threshold has been crossed by its predecessor. (Predecessor
    // is the spring directly before it in the items array.)
    for (let i = 1; i < springs.length; i++) {
      const sp = springs[i]!;
      if (sp.started) continue;
      const prev = springs[i - 1]!;
      if (!prev.started) continue;
      const prevProgress =
        range === 0 ? 1 : Math.abs(prev.state.position - from) / range;
      if (prevProgress >= sp.item.offset) {
        sp.started = true;
      }
    }

    recordFrame(time);

    if (springs.every((sp) => sp.settled)) {
      return time;
    }
  }

  return lastFrameTime;
}

/**
 * Pull a spring config out of a user-supplied PhysicsOptions override. If the
 * user passed inertia or a custom integrator (rare for film), we fall back to
 * the default — offline baking only supports spring physics here.
 */
function extractSpring(
  override: PhysicsOptions | undefined,
  fallback: SpringConfig,
): SpringConfig {
  if (override?.spring) {
    return {
      stiffness: override.spring.stiffness,
      damping: override.spring.damping,
    };
  }
  return fallback;
}

/**
 * Per-frame snapshot of the shared transform state written by the ticks.
 */
interface FrameSnapshot {
  time: number;
  scale: number;
  translateY: number;
}

/**
 * Run film's three-spring schedule offline (matching what the live ticks
 * would produce) and capture per-frame snapshots of the shared (scale, ty)
 * state. Returns snapshots + total duration.
 */
function bakeFilmFrames(opts: {
  rect: { top: number; height: number };
  springs: typeof DEFAULT_SPRINGS;
  scale: number;
  direction: "in" | "out";
  override: PhysicsOptions | undefined;
}): { snapshots: FrameSnapshot[]; totalDuration: number } {
  const { rect, springs, scale, direction, override } = opts;

  // Initial shared state — matches the closure init in the original tick
  // implementation.
  const sharedState =
    direction === "out"
      ? { scale: 1, translateY: -rect.top }
      : { scale, translateY: -rect.top + rect.height };

  const sdSpring = extractSpring(override, springs.scaleDown);
  const trSpring = extractSpring(override, springs.translate);
  const suSpring = extractSpring(override, springs.scaleUp);

  // Animator-level from/to — matches what ssgoi's MultiAnimator would feed
  // each child SingleAnimator. OUT runs 1→0, IN runs 0→1; the tick formulas
  // re-map this into the visible (scale, ty) space.
  const from = direction === "out" ? 1 : 0;
  const to = direction === "out" ? 0 : 1;

  // Tick formulas — pulled verbatim from the previous tick-mode film
  // implementation. They write to `sharedState` exactly as before.
  const items: BakedSpringItem[] =
    direction === "out"
      ? [
          {
            spring: sdSpring,
            offset: OFFSETS.scaleDown,
            tick: (position) => {
              const p = 1 - position; // OUT: position 1→0 ⇒ p 0→1
              sharedState.scale = 1 - (1 - scale) * p;
            },
          },
          {
            spring: trSpring,
            offset: OFFSETS.translate,
            tick: (position) => {
              const p = 1 - position;
              sharedState.translateY = -rect.top - rect.height * p;
            },
          },
          {
            spring: suSpring,
            offset: OFFSETS.scaleUp,
            tick: (position) => {
              const p = 1 - position;
              sharedState.scale = scale + (1 - scale) * p;
            },
          },
        ]
      : [
          {
            spring: sdSpring,
            offset: OFFSETS.scaleDown,
            tick: (position) => {
              // IN: position 0→1
              sharedState.scale = 1 - (1 - scale) * position;
            },
          },
          {
            spring: trSpring,
            offset: OFFSETS.translate,
            tick: (position) => {
              sharedState.translateY = -rect.top + rect.height * (1 - position);
            },
          },
          {
            spring: suSpring,
            offset: OFFSETS.scaleUp,
            tick: (position) => {
              sharedState.scale = scale + (1 - scale) * position;
            },
          },
        ];

  const snapshots: FrameSnapshot[] = [];
  const totalDuration = bakeStaggerSchedule({
    items,
    from,
    to,
    recordFrame: (time) => {
      snapshots.push({
        time,
        scale: sharedState.scale,
        translateY: sharedState.translateY,
      });
    },
  });

  return { snapshots, totalDuration };
}

/**
 * Convert per-frame snapshots into a Keyframe[] via a per-element style
 * builder. The builder receives the shared snapshot — every element animates
 * off the same captured tick state, so they stay perfectly in sync.
 */
function snapshotsToKeyframes(
  snapshots: FrameSnapshot[],
  totalDuration: number,
  toStyle: (snap: FrameSnapshot) => Record<string, string>,
): Keyframe[] {
  if (snapshots.length === 0 || totalDuration === 0) return [];
  return snapshots.map((snap) => ({
    ...toStyle(snap),
    offset: Math.min(1, Math.max(0, snap.time / totalDuration)),
  })) as Keyframe[];
}

export const film = (options?: FilmOptions): SggoiTransition => {
  const springs = DEFAULT_SPRINGS;
  const scale = DEFAULT_SCALE;
  const borderColor = options?.border?.color ?? DEFAULT_BORDER_COLOR;

  return {
    out: async (element, context): Promise<MultiAnimationConfig> => {
      const rect = getFilmRect(context);
      const containerRect = getRect(document.body, context.positionedParent);

      const borderElements = createCornerBorders(borderColor, {
        ...rect,
        top: containerRect.top,
      });

      const { snapshots, totalDuration } = bakeFilmFrames({
        rect,
        springs,
        scale,
        direction: "out",
        override: options?.physics,
      });

      const mainFrames = snapshotsToKeyframes(
        snapshots,
        totalDuration,
        (s) => ({
          transform: `translateY(${s.translateY}px) scale(${s.scale})`,
        }),
      );

      const borderFrames = BORDER_SIGNS.map(([sx, sy]) =>
        snapshotsToKeyframes(snapshots, totalDuration, (s) => {
          const ox = ((rect.width - rect.width * s.scale) / 2) * 0.7 * sx;
          const oy = ((rect.height - rect.height * s.scale) / 2) * 0.7 * sy;
          return { transform: `translate(${ox}px, ${oy}px)` };
        }),
      );

      return {
        items: [
          {
            keyframes: { element, frames: mainFrames, duration: totalDuration },
          },
          ...borderFrames.map((frames, i) => ({
            keyframes: {
              element: BORDER_ORDER[i]!(borderElements),
              frames,
              duration: totalDuration,
            },
          })),
        ],
        schedule: "parallel",
        prepare: () => {
          prepareOutgoing(element);
          applyFilmTransformOrigin(element, rect);
          applyFilmClip(element, rect);
          applyFlimTranslate(element, rect);

          for (const border of borderElements) {
            context.positionedParent.appendChild(border);
          }
        },
        onEnd: () => {
          element.style.clipPath = "";
          element.style.transformOrigin = "";

          setTimeout(() => {
            for (const border of borderElements) {
              context.positionedParent.removeChild(border);
            }
          }, 1000);
        },
      };
    },

    in: async (element, context): Promise<MultiAnimationConfig> => {
      const rect = getFilmRect(context);

      const { snapshots, totalDuration } = bakeFilmFrames({
        rect,
        springs,
        scale,
        direction: "in",
        override: options?.physics,
      });

      const mainFrames = snapshotsToKeyframes(
        snapshots,
        totalDuration,
        (s) => ({
          transform: `translateY(${s.translateY}px) scale(${s.scale})`,
        }),
      );

      return {
        items: [
          {
            keyframes: { element, frames: mainFrames, duration: totalDuration },
          },
        ],
        schedule: "parallel",
        prepare: () => {
          applyFilmTransformOrigin(element, rect);
          applyFilmClip(element, rect);
          element.style.transform = `translateY(${-rect.top + rect.height}px) scale(${scale})`;
        },
        onEnd: () => {
          element.style.clipPath = "";
          element.style.transformOrigin = "";
          element.style.transform = "";
        },
      };
    },
  };
};

// Border sign matrix matches BORDER_ORDER below: TL, TR, BL, BR.
const BORDER_SIGNS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

const BORDER_ORDER: Array<(b: CornerBorders) => HTMLElement> = [
  (b) => b.topLeft,
  (b) => b.topRight,
  (b) => b.bottomLeft,
  (b) => b.bottomRight,
];

interface CornerBorders extends Iterable<HTMLElement> {
  topLeft: HTMLElement;
  topRight: HTMLElement;
  bottomLeft: HTMLElement;
  bottomRight: HTMLElement;
}

/**
 * Create corner border elements (ㄴ ㄱ shapes)
 */
function createCornerBorders(
  color: string = "white",
  rect: ReturnType<typeof getFilmRect>,
): CornerBorders {
  const borderWidth = 1;
  const borderLength = 15;

  // Top-left corner
  const topLeft = document.createElement("div");
  topLeft.style.position = "fixed";
  topLeft.style.pointerEvents = "none";
  topLeft.style.zIndex = "9999";
  topLeft.style.top = `${rect.top - borderWidth}px`;
  topLeft.style.left = `${rect.left - borderWidth}px`;
  topLeft.style.width = `${borderLength}px`;
  topLeft.style.height = `${borderLength}px`;
  // Horizontal line
  const topLeftH = document.createElement("div");
  topLeftH.style.position = "absolute";
  topLeftH.style.width = `${borderLength}px`;
  topLeftH.style.height = `${borderWidth}px`;
  topLeftH.style.backgroundColor = color;
  topLeftH.style.top = "0";
  topLeftH.style.left = "0";
  // Vertical line
  const topLeftV = document.createElement("div");
  topLeftV.style.position = "absolute";
  topLeftV.style.width = `${borderWidth}px`;
  topLeftV.style.height = `${borderLength}px`;
  topLeftV.style.backgroundColor = color;
  topLeftV.style.top = "0";
  topLeftV.style.left = "0";
  topLeft.appendChild(topLeftH);
  topLeft.appendChild(topLeftV);

  // Top-right corner
  const topRight = document.createElement("div");
  topRight.style.position = "fixed";
  topRight.style.pointerEvents = "none";
  topRight.style.zIndex = "9999";
  topRight.style.top = `${rect.top - borderWidth}px`;
  topRight.style.left = `${rect.left + rect.width - borderLength + borderWidth}px`;
  topRight.style.width = `${borderLength}px`;
  topRight.style.height = `${borderLength}px`;
  // Horizontal line
  const topRightH = document.createElement("div");
  topRightH.style.position = "absolute";
  topRightH.style.width = `${borderLength}px`;
  topRightH.style.height = `${borderWidth}px`;
  topRightH.style.backgroundColor = color;
  topRightH.style.top = "0";
  topRightH.style.right = "0";
  // Vertical line
  const topRightV = document.createElement("div");
  topRightV.style.position = "absolute";
  topRightV.style.width = `${borderWidth}px`;
  topRightV.style.height = `${borderLength}px`;
  topRightV.style.backgroundColor = color;
  topRightV.style.top = "0";
  topRightV.style.right = "0";
  topRight.appendChild(topRightH);
  topRight.appendChild(topRightV);

  // Bottom-left corner
  const bottomLeft = document.createElement("div");
  bottomLeft.style.position = "fixed";
  bottomLeft.style.pointerEvents = "none";
  bottomLeft.style.zIndex = "9999";
  bottomLeft.style.top = `${rect.top + rect.height - borderLength + borderWidth}px`;
  bottomLeft.style.left = `${rect.left - borderWidth}px`;
  bottomLeft.style.width = `${borderLength}px`;
  bottomLeft.style.height = `${borderLength}px`;
  // Horizontal line
  const bottomLeftH = document.createElement("div");
  bottomLeftH.style.position = "absolute";
  bottomLeftH.style.width = `${borderLength}px`;
  bottomLeftH.style.height = `${borderWidth}px`;
  bottomLeftH.style.backgroundColor = color;
  bottomLeftH.style.bottom = "0";
  bottomLeftH.style.left = "0";
  // Vertical line
  const bottomLeftV = document.createElement("div");
  bottomLeftV.style.position = "absolute";
  bottomLeftV.style.width = `${borderWidth}px`;
  bottomLeftV.style.height = `${borderLength}px`;
  bottomLeftV.style.backgroundColor = color;
  bottomLeftV.style.bottom = "0";
  bottomLeftV.style.left = "0";
  bottomLeft.appendChild(bottomLeftH);
  bottomLeft.appendChild(bottomLeftV);

  // Bottom-right corner
  const bottomRight = document.createElement("div");
  bottomRight.style.position = "fixed";
  bottomRight.style.pointerEvents = "none";
  bottomRight.style.zIndex = "9999";
  bottomRight.style.top = `${rect.top + rect.height - borderLength + borderWidth}px`;
  bottomRight.style.left = `${rect.left + rect.width - borderLength + borderWidth}px`;
  bottomRight.style.width = `${borderLength}px`;
  bottomRight.style.height = `${borderLength}px`;
  // Horizontal line
  const bottomRightH = document.createElement("div");
  bottomRightH.style.position = "absolute";
  bottomRightH.style.width = `${borderLength}px`;
  bottomRightH.style.height = `${borderWidth}px`;
  bottomRightH.style.backgroundColor = color;
  bottomRightH.style.bottom = "0";
  bottomRightH.style.right = "0";
  // Vertical line
  const bottomRightV = document.createElement("div");
  bottomRightV.style.position = "absolute";
  bottomRightV.style.width = `${borderWidth}px`;
  bottomRightV.style.height = `${borderLength}px`;
  bottomRightV.style.backgroundColor = color;
  bottomRightV.style.top = "0";
  bottomRightV.style.right = "0";
  bottomRight.appendChild(bottomRightH);
  bottomRight.appendChild(bottomRightV);

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    *[Symbol.iterator]() {
      yield topLeft;
      yield topRight;
      yield bottomLeft;
      yield bottomRight;
    },
  };
}

/**
 * Calculate the visible viewport rect for film transition
 * Returns the area where the transition will be visible
 */
function getFilmRect(context: SggoiTransitionContext) {
  const containerRect = getRect(document.body, context.positionedParent);
  const top = context.scroll.y;

  return {
    top,
    left: 0,
    width: containerRect.width,
    height: window.innerHeight - containerRect.top,
  };
}

/**
 * Set transform-origin to the center of film rect
 */
function applyFilmTransformOrigin(
  element: HTMLElement,
  rect: ReturnType<typeof getFilmRect>,
) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  element.style.transformOrigin = `${centerX}px ${centerY}px`;
}

/**
 * Apply clipPath to limit element visibility to film rect
 * Common prepare function for both in and out transitions
 */
function applyFilmClip(
  element: HTMLElement,
  rect: ReturnType<typeof getFilmRect>,
) {
  element.style.clipPath = `polygon(
    ${rect.left}px ${rect.top}px,
    ${rect.left + rect.width}px ${rect.top}px,
    ${rect.left + rect.width}px ${rect.top + rect.height}px,
    ${rect.left}px ${rect.top + rect.height}px
  )`;
}

function applyFlimTranslate(
  element: HTMLElement,
  rect: ReturnType<typeof getFilmRect>,
) {
  element.style.transform = `translateY(${-rect.top}px)`;
}
