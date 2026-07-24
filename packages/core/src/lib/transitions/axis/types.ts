import type { PhysicsOptions, StyleObject } from "@types";
import type { MultiAnimationOptions } from "../../animation/multi-animation";

export type AxisType = "x" | "y" | "z";
export type AxisDirection = "forward" | "backward";

/**
 * UX flavor *within* a single axis. Independent dimension from `AxisType`; the
 * set of meaningful values differs per type:
 *   - x: `snappy` (KakaoTalk tab swap) | `fluid` (Material SharedAxisTransition)
 *   - y: `directional` (forward = bottom→top) | `non-directional` (in always
 *     rises from below; out fades in place)
 *   - z: `snappy` only
 *
 * Providers may alias unsupported feels to an in-axis default — `snappy` is
 * the universal fallback inside `resolveAxisProvider`.
 */
export type AxisFeel = "snappy" | "fluid" | "directional" | "non-directional";

export interface AxisOptions {
  type?: AxisType;
  feel?: AxisFeel;
}

export type AxisAnimateFunc = (progress: number) => StyleObject;

export interface AxisSideConfig {
  willChange: string;
  startStyle: StyleObject;
  animate: AxisAnimateFunc;
}

export interface AxisAnimationConfig {
  out: AxisSideConfig;
  in: AxisSideConfig;
}

export interface AxisProviderBuildArgs {
  direction: AxisDirection;
}

export interface AxisProvider {
  /**
   * Physics for the outgoing side. Split from `inPhysics` so a provider can
   * mix integrators (e.g. fluid's x uses inertia for out + spring for in, so
   * the outgoing page falls away under acceleration while the incoming page
   * springs into place).
   */
  outPhysics: PhysicsOptions;
  /** Physics for the incoming side. */
  inPhysics: PhysicsOptions;
  /**
   * How the out/in animations compose. Each axis has its own timing (e.g. x/y
   * use a slight startAt offset for cross-fade overlap, z runs both in place
   * and typically starts together). Provider decides — transition.ts just
   * forwards this to MultiAnimation.
   */
  composition?: MultiAnimationOptions;
  /** `direction` is only meaningful for the sided providers (x, y). */
  build: (args: AxisProviderBuildArgs) => AxisAnimationConfig;
}
