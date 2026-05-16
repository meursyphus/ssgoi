import type { PhysicsOptions } from "@types";

export type DrillType = "parallax" | "crossfade";
export type DrillDirection = "enter" | "exit";

export interface DrillOptions {
  type?: DrillType;
  direction?: DrillDirection;
}

export type DrillStyle = Record<string, number | string>;
export type DrillAnimateFunc = (progress: number) => DrillStyle;

export interface DrillSideConfig {
  willChange: string;
  startStyle: DrillStyle;
  animate: DrillAnimateFunc;
}

export interface DrillAnimationConfig {
  out: DrillSideConfig;
  in: DrillSideConfig;
}

export interface DrillProvider {
  physics: PhysicsOptions;
  build: (direction: DrillDirection) => DrillAnimationConfig;
}
