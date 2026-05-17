import type { PhysicsOptions, StyleObject } from "@types";
import type { MultiAnimationOptions } from "../../animation/multi-animation";

export type AxisType = "x" | "y" | "z";
export type AxisDirection = "forward" | "backward";

export interface AxisOptions {
  type?: AxisType;
  direction?: AxisDirection;
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
  physics: PhysicsOptions;
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
