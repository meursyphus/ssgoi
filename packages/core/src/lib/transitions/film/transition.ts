import type {
  PhysicsOptions,
  SpringConfig,
  StyleObject,
  TransitionConfig,
} from "@types";
import { getRect, getViewportRect } from "@utils";
import { Animation, MultiAnimation, WebAnimation } from "../../animation";
import {
  LinearIntegrator,
  SETTLE_THRESHOLD,
  SpringIntegrator,
} from "../../animation/integrator";

/**
 * Film transition (cinematic page transition).
 *
 * The original UX is a three-spring stagger: scale-down, translate, scale-up.
 * Each spring has its own physics and starts at a stagger offset of the
 * previous spring's progress. Re-built on the new Animation API by:
 *  1. Baking the stagger schedule into a per-frame snapshot table off-line.
 *  2. Driving a `WebAnimation` at constant time-velocity via `LinearIntegrator`
 *     so the keyframes fed to WAAPI follow the baked curve exactly.
 *
 * Corner borders are independent WebAnimations that re-use the same baked
 * frames; they composite into the same `MultiAnimation` so they share start
 * and end with the main element.
 */

const DEFAULT_SPRINGS = {
  scaleDown: { stiffness: 20, damping: 7 } as SpringConfig,
  translate: { stiffness: 15, damping: 7 } as SpringConfig,
  scaleUp: { stiffness: 20, damping: 7 } as SpringConfig,
};

const OFFSETS = {
  scaleDown: 0,
  translate: 0.2,
  scaleUp: 0.8,
} as const;

const DEFAULT_SCALE = 0.8;
const DEFAULT_BORDER_COLOR = "white";

const FRAME_MS = 1000 / 60;
const MAX_FRAMES = 600;

export interface FilmOptions {
  border?: { color?: string };
  physics?: PhysicsOptions;
}

interface BakedSpringItem {
  spring: SpringConfig;
  offset: number;
  tick: (position: number) => void;
}

/**
 * Run a stagger schedule of springs offline, frame by frame. Mirrors the
 * legacy multi-animator: items tick in array order each frame, and items
 * with stagger offsets start when the previous item's progress crosses
 * their threshold. After every frame's ticks, `recordFrame` snapshots the
 * shared state the ticks wrote to.
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

  type Runtime = {
    item: BakedSpringItem;
    integrator: SpringIntegrator;
    state: { position: number; velocity: number };
    started: boolean;
    settled: boolean;
    settleTime: number;
  };

  const springs: Runtime[] = items.map((item) => ({
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

  for (let i = 0; i < springs.length; i++) {
    if (i === 0 || springs[i]!.item.offset === 0) springs[i]!.started = true;
  }

  recordFrame(0);

  let lastFrameTime = 0;
  for (let frame = 1; frame <= MAX_FRAMES; frame++) {
    const time = frame * FRAME_MS;
    lastFrameTime = time;

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

    for (let i = 1; i < springs.length; i++) {
      const sp = springs[i]!;
      if (sp.started) continue;
      const prev = springs[i - 1]!;
      if (!prev.started) continue;
      const prevProgress =
        range === 0 ? 1 : Math.abs(prev.state.position - from) / range;
      if (prevProgress >= sp.item.offset) sp.started = true;
    }

    recordFrame(time);
    if (springs.every((sp) => sp.settled)) return time;
  }

  return lastFrameTime;
}

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

interface FilmSnapshot {
  time: number;
  scale: number;
  translateY: number;
}

function bakeFilmSnapshots(opts: {
  rect: { top: number; height: number };
  scale: number;
  direction: "in" | "out";
  override: PhysicsOptions | undefined;
}): { snapshots: FilmSnapshot[]; totalDuration: number } {
  const { rect, scale, direction, override } = opts;

  const shared =
    direction === "out"
      ? { scale: 1, translateY: -rect.top }
      : { scale, translateY: -rect.top + rect.height };

  const sd = extractSpring(override, DEFAULT_SPRINGS.scaleDown);
  const tr = extractSpring(override, DEFAULT_SPRINGS.translate);
  const su = extractSpring(override, DEFAULT_SPRINGS.scaleUp);

  const from = direction === "out" ? 1 : 0;
  const to = direction === "out" ? 0 : 1;

  const items: BakedSpringItem[] =
    direction === "out"
      ? [
          {
            spring: sd,
            offset: OFFSETS.scaleDown,
            tick: (p) => {
              const u = 1 - p;
              shared.scale = 1 - (1 - scale) * u;
            },
          },
          {
            spring: tr,
            offset: OFFSETS.translate,
            tick: (p) => {
              const u = 1 - p;
              shared.translateY = -rect.top - rect.height * u;
            },
          },
          {
            spring: su,
            offset: OFFSETS.scaleUp,
            tick: (p) => {
              const u = 1 - p;
              shared.scale = scale + (1 - scale) * u;
            },
          },
        ]
      : [
          {
            spring: sd,
            offset: OFFSETS.scaleDown,
            tick: (p) => {
              shared.scale = 1 - (1 - scale) * p;
            },
          },
          {
            spring: tr,
            offset: OFFSETS.translate,
            tick: (p) => {
              shared.translateY = -rect.top + rect.height * (1 - p);
            },
          },
          {
            spring: su,
            offset: OFFSETS.scaleUp,
            tick: (p) => {
              shared.scale = scale + (1 - scale) * p;
            },
          },
        ];

  const snapshots: FilmSnapshot[] = [];
  const totalDuration = bakeStaggerSchedule({
    items,
    from,
    to,
    recordFrame: (time) =>
      snapshots.push({
        time,
        scale: shared.scale,
        translateY: shared.translateY,
      }),
  });

  return { snapshots, totalDuration };
}

/** Linear-time progress `t` (0→1) maps to baked snapshot index. */
function sampleSnapshot(snapshots: FilmSnapshot[], t: number): FilmSnapshot {
  if (snapshots.length === 0) return { time: 0, scale: 1, translateY: 0 };
  if (snapshots.length === 1) return snapshots[0]!;
  if (t <= 0) return snapshots[0]!;
  if (t >= 1) return snapshots[snapshots.length - 1]!;
  const idx = t * (snapshots.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return snapshots[lo]!;
  const a = snapshots[lo]!;
  const b = snapshots[hi]!;
  const frac = idx - lo;
  return {
    time: a.time + (b.time - a.time) * frac,
    scale: a.scale + (b.scale - a.scale) * frac,
    translateY: a.translateY + (b.translateY - a.translateY) * frac,
  };
}

const BORDER_SIGNS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

interface CornerBorders {
  topLeft: HTMLElement;
  topRight: HTMLElement;
  bottomLeft: HTMLElement;
  bottomRight: HTMLElement;
}

function makeCornerBorders(
  color: string,
  rect: { top: number; left: number; width: number; height: number },
): CornerBorders {
  const borderWidth = 1;
  const borderLength = 15;
  const make = (
    side: { top: string; left: string },
    hAlign: "left" | "right",
    vAlign: "top" | "bottom",
  ): HTMLElement => {
    const node = document.createElement("div");
    Object.assign(node.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: "9999",
      width: `${borderLength}px`,
      height: `${borderLength}px`,
      ...side,
    });

    const h = document.createElement("div");
    Object.assign(h.style, {
      position: "absolute",
      width: `${borderLength}px`,
      height: `${borderWidth}px`,
      backgroundColor: color,
      [vAlign]: "0",
      [hAlign]: "0",
    } as Record<string, string>);

    const v = document.createElement("div");
    Object.assign(v.style, {
      position: "absolute",
      width: `${borderWidth}px`,
      height: `${borderLength}px`,
      backgroundColor: color,
      [vAlign]: "0",
      [hAlign]: "0",
    } as Record<string, string>);

    node.appendChild(h);
    node.appendChild(v);
    return node;
  };

  return {
    topLeft: make(
      {
        top: `${rect.top - borderWidth}px`,
        left: `${rect.left - borderWidth}px`,
      },
      "left",
      "top",
    ),
    topRight: make(
      {
        top: `${rect.top - borderWidth}px`,
        left: `${rect.left + rect.width - borderLength + borderWidth}px`,
      },
      "right",
      "top",
    ),
    bottomLeft: make(
      {
        top: `${rect.top + rect.height - borderLength + borderWidth}px`,
        left: `${rect.left - borderWidth}px`,
      },
      "left",
      "bottom",
    ),
    bottomRight: make(
      {
        top: `${rect.top + rect.height - borderLength + borderWidth}px`,
        left: `${rect.left + rect.width - borderLength + borderWidth}px`,
      },
      "right",
      "bottom",
    ),
  };
}

type FilmRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function applyFilmTransformOrigin(el: HTMLElement, rect: FilmRect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  el.style.transformOrigin = `${centerX}px ${centerY}px`;
}

function applyFilmClip(el: HTMLElement, rect: FilmRect) {
  el.style.clipPath = `polygon(
    ${rect.left}px ${rect.top}px,
    ${rect.left + rect.width}px ${rect.top}px,
    ${rect.left + rect.width}px ${rect.top + rect.height}px,
    ${rect.left}px ${rect.top + rect.height}px
  )`;
}

function makeFilmAnimation(
  element: HTMLElement,
  snapshots: FilmSnapshot[],
  totalDuration: number,
  style: (snap: FilmSnapshot) => StyleObject,
  onComplete?: () => void,
): WebAnimation {
  const durationSec = totalDuration / 1000;
  return new WebAnimation({
    element,
    integrator: new LinearIntegrator({ durationSec }),
    lowerBound: 0,
    upperBound: 1,
    style: (t) => style(sampleSnapshot(snapshots, t)),
    onComplete,
  });
}

type FilmExtras = {
  borders: CornerBorders;
  fromRect: FilmRect;
  toRect: FilmRect;
};

export const film = (
  options: FilmOptions = {},
): TransitionConfig<FilmExtras> => {
  const borderColor = options.border?.color ?? DEFAULT_BORDER_COLOR;
  const scale = DEFAULT_SCALE;
  const physicsOverride = options.physics;

  return {
    prepare: ({ from, to, context }) => {
      const fromRect = getViewportRect(context, "from");
      const toRect = getViewportRect(context, "to");
      const containerRect = getRect(document.body, context.positionedParent);

      const borders = makeCornerBorders(borderColor, {
        ...fromRect,
        top: containerRect.top,
      });
      for (const key of [
        "topLeft",
        "topRight",
        "bottomLeft",
        "bottomRight",
      ] as const) {
        context.positionedParent.appendChild(borders[key]);
      }

      from.then((el) => {
        applyFilmTransformOrigin(el, fromRect);
        applyFilmClip(el, fromRect);
        el.style.transform = `translateY(${-fromRect.top}px)`;
      });
      to.then((el) => {
        applyFilmTransformOrigin(el, toRect);
        applyFilmClip(el, toRect);
        el.style.transform = `translateY(${-toRect.top + toRect.height}px) scale(${scale})`;
      });

      return { borders, fromRect, toRect };
    },
    animation: ({ from, to, context, borders, fromRect, toRect }) => {
      const out = bakeFilmSnapshots({
        rect: fromRect,
        scale,
        direction: "out",
        override: physicsOverride,
      });
      const inn = bakeFilmSnapshots({
        rect: toRect,
        scale,
        direction: "in",
        override: physicsOverride,
      });

      const mainOut = makeFilmAnimation(
        from,
        out.snapshots,
        out.totalDuration,
        (s) => ({
          transform: `translateY(${s.translateY}px) scale(${s.scale})`,
        }),
        () => {
          // The outgoing node is reused (re-hidden, shown on the next
          // navigation), so every inline style this transition wrote to `from`
          // must be reset here — mirroring the `to` cleanup below — or the
          // stale clip/origin/transform corrupts the page when it reappears.
          from.style.clipPath = "";
          from.style.transformOrigin = "";
          from.style.transform = "";
        },
      );

      const mainIn = makeFilmAnimation(
        to,
        inn.snapshots,
        inn.totalDuration,
        (s) => ({
          transform: `translateY(${s.translateY}px) scale(${s.scale})`,
        }),
        () => {
          to.style.clipPath = "";
          to.style.transformOrigin = "";
          to.style.transform = "";
        },
      );

      const borderAnims: Animation[] = BORDER_SIGNS.map(([sx, sy], i) => {
        const key = (
          ["topLeft", "topRight", "bottomLeft", "bottomRight"] as const
        )[i]!;
        return makeFilmAnimation(
          borders[key],
          out.snapshots,
          out.totalDuration,
          (s) => {
            const ox =
              ((fromRect.width - fromRect.width * s.scale) / 2) * 0.7 * sx;
            const oy =
              ((fromRect.height - fromRect.height * s.scale) / 2) * 0.7 * sy;
            return { transform: `translate(${ox}px, ${oy}px)` };
          },
        );
      });

      const composite = new MultiAnimation([mainOut, mainIn, ...borderAnims], {
        mode: "parallel",
      });

      const prevOnComplete = composite.onComplete;
      composite.onComplete = () => {
        prevOnComplete?.();
        const positionedParent = context.positionedParent;
        for (const key of [
          "topLeft",
          "topRight",
          "bottomLeft",
          "bottomRight",
        ] as const) {
          const node = borders[key];
          if (node.parentElement === positionedParent) {
            positionedParent.removeChild(node);
          }
        }
      };

      return composite;
    },
  };
};
