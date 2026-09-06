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

/** No overshoot, the default arriving feel. 0.40 s. */
export const smooth = spring({ duration: 0.4 });

/** Short travel with a hint of elasticity (tab swaps). 0.30 s, bounce 0.15. */
export const snappy = spring({ duration: 0.3, bounce: 0.15 });

/** Visible overshoot for emphasis. 0.45 s, bounce 0.3 — the UI ceiling. */
export const bouncy = spring({ duration: 0.45, bounce: 0.3 });

/** Large surfaces such as sheets. 0.55 s, no overshoot. */
export const gentle = spring({ duration: 0.55 });

/** Effects (opacity, blur) and fast exits. 0.20 s, no overshoot. */
export const swift = spring({ duration: 0.2 });

/** Accelerating fall-away for outgoing surfaces. Reaches target in 0.20 s. */
export const accelerate = easeIn({ duration: 0.2 });
