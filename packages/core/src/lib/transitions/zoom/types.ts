import type { PhysicsOptions } from "@types";

export type ZoomType = "expand" | "static" | "blur";

export interface ZoomOptions {
  type: ZoomType;
  timeout?: number;
  fade?: boolean;
}

export type ZoomStyleObject = Record<string, string>;
export type ZoomAnimationFunc = (progress: number) => ZoomStyleObject;

export interface ZoomAnimationConfig {
  transformOrigin: string;
  animate: ZoomAnimationFunc;
}

export interface ZoomAnimationInput {
  enterRect: DOMRect;
  exitRect: DOMRect;
  pageRect: DOMRect;
  scrollOffset: { x: number; y: number };
  enterRadius: number;
  exitRadius: number;
}

export interface ZoomOverlayConfig {
  willChange: string;
  initialStyle: Record<string, string>;
  style: (
    mode: "enter" | "exit",
    progress: number,
  ) => Record<string, string | number>;
}

export interface ZoomProvider {
  physics: PhysicsOptions;
  in: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  out: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  backgroundIn: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  backgroundOut: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  overlay?: ZoomOverlayConfig;
}

export interface ZoomAnimationHandlers {
  mode: "enter" | "exit";
  inAnimation?: ZoomAnimationFunc;
  outAnimation?: ZoomAnimationFunc;
}
