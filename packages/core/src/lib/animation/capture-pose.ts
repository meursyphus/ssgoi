import type { Pose } from "@types";

export type CapturePoseOptions = {
  /**
   * Read the element's current visual value from computed styles, in the
   * same scale as `lowerBound`/`upperBound` (e.g. parse opacity for a 0→1
   * fade). Called twice — once at the live playback position and once a few
   * milliseconds rewound — to estimate velocity.
   */
  read: (element: HTMLElement) => number;
  /** Bounds the read value lives in. @default 0 / 1 */
  lowerBound?: number;
  upperBound?: number;
  /** Role/identity key to attach to the captured pose (see pose-matching). */
  key?: string;
  /**
   * How far (ms) to rewind the running animations for the velocity sample.
   * @default 8
   */
  sampleMs?: number;
  /**
   * Cancel the captured animations after sampling so they stop competing
   * with the handoff target. @default false
   */
  cancel?: boolean;
};

const DEFAULT_SAMPLE_MS = 8;

/**
 * Capture a motion-matching `Pose` from animations ssgoi does NOT drive —
 * CSS animations/transitions or WAAPI runs started by other code ("host"
 * animations). Feed the result into `animation.matchInto([pose])` so a
 * ssgoi transition takes over an in-flight external motion continuously
 * instead of restarting from rest.
 *
 * Velocity is estimated by seeking every running animation to the local
 * time that was on screen `sampleMs` of wall-clock ago (i.e. rewinding by
 * `sampleMs × playbackRate`, which also handles reversed playback),
 * re-reading the visual value, and restoring playback position — all
 * synchronous within one task, so the visible playback never moves.
 * Animations that contribute no live motion are excluded from the sample:
 * rate-0 animations are visually frozen (yet still report playState
 * "running"), and future-scheduled animations (negative currentTime) would
 * be seeked forward into keyframe states that were never on screen. When an
 * animation is too young to rewind the full window the largest achievable
 * wall-clock window is used as the divisor, which can only under-estimate
 * speed.
 *
 * Returns `null` when nothing is running on the element.
 */
export function capturePoseFrom(
  element: HTMLElement,
  options: CapturePoseOptions,
): Pose | null {
  if (typeof element.getAnimations !== "function") return null;
  const running = element
    .getAnimations()
    .filter((animation) => animation.playState === "running");
  if (running.length === 0) return null;

  const value = options.read(element);
  const sampleMs = options.sampleMs ?? DEFAULT_SAMPLE_MS;

  const rewound: {
    animation: globalThis.Animation;
    time: number;
    rate: number;
  }[] = [];
  let velocity = 0;
  try {
    for (const animation of running) {
      const time = animation.currentTime;
      const rate = animation.playbackRate;
      if (typeof time !== "number" || time <= 0 || rate === 0) continue;
      rewound.push({ animation, time, rate });
      // The visual state `sampleMs` of wall-clock ago lives at local time
      // `time - rate × sampleMs` — a reversed animation's past is at a
      // LATER local time.
      animation.currentTime = Math.max(0, time - rate * sampleMs);
    }
    if (rewound.length > 0) {
      // Achieved wall-clock window per animation (the clamp above can
      // shrink it near the start); divide by the largest so the estimate
      // stays conservative.
      const actualMs = Math.max(
        ...rewound.map((r) =>
          Math.abs((r.time - (r.animation.currentTime as number)) / r.rate),
        ),
      );
      if (actualMs > 0) {
        const earlier = options.read(element);
        velocity = ((value - earlier) / actualMs) * 1000;
      }
    }
  } finally {
    for (const { animation, time } of rewound) {
      animation.currentTime = time;
    }
  }

  if (options.cancel) {
    for (const animation of running) animation.cancel();
  }

  return {
    element,
    value,
    velocity,
    key: options.key,
    lowerBound: options.lowerBound ?? 0,
    upperBound: options.upperBound ?? 1,
  };
}
