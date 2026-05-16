import type { PhysicsOptions } from "@types";

export type ZoomType = "expand" | "static";

export interface ZoomOptions {
  type: ZoomType;
  timeout?: number;
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
}

export interface ZoomProvider {
  physics: PhysicsOptions;
  in: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  out: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  backgroundIn: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  backgroundOut: (input: ZoomAnimationInput) => ZoomAnimationConfig;
}

export interface ZoomAnimationHandlers {
  mode: "enter" | "exit";
  inAnimation?: ZoomAnimationFunc;
  outAnimation?: ZoomAnimationFunc;
}
