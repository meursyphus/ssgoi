import { easeIn, spring } from "./spring";

/*
 * Semantic integrator presets. Pick a feel, not a number. The values are
 * ssgoi's current best guess at "good UX timing" for page transitions; they
 * follow SwiftUI's smooth / snappy / bouncy bounce levels (0 / 0.15 / 0.3)
 * with durations shortened for full-page motion, and will be recalibrated
 * against real app recordings.
 *
 * Every export is a stateless `Integrator` instance — share it freely.
 */

/** No overshoot, the default arriving feel. */
export const smooth = spring({
  stiffness: 246.74011002723395,
  damping: 31.41592653589793,
});

/** Short travel with a hint of elasticity for tab swaps. */
export const snappy = spring({
  stiffness: 438.6490844928604,
  damping: 35.604716740684324,
});

/** Visible overshoot for emphasis. */
export const bouncy = spring({
  stiffness: 194.9551486634935,
  damping: 19.54768762233649,
});

/** No overshoot for large surfaces such as sheets. */
export const gentle = spring({
  stiffness: 130.5071656342394,
  damping: 22.84794657156213,
});

/** No overshoot for opacity, blur, and fast exits. */
export const swift = spring({
  stiffness: 986.9604401089358,
  damping: 62.83185307179586,
});

/** Accelerating fall-away for outgoing surfaces. Reaches target in 0.20 s. */
export const accelerate = easeIn({ duration: 0.2 });
