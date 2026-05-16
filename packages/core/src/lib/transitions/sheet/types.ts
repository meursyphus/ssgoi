import type { PhysicsOptions } from "@types";

export type SheetType = "static" | "background-scale";
export type SheetDirection = "enter" | "exit";

export interface SheetOptions {
  type?: SheetType;
  direction?: SheetDirection;
}

export type SheetStyle = Record<string, number | string>;

export interface SheetBackgroundConfig {
  willChange: string;
  enterStyle: (t: number, u: number) => SheetStyle;
  exitStyle: (t: number) => SheetStyle;
}

export interface SheetProvider {
  enterPhysics: PhysicsOptions;
  exitPhysics: PhysicsOptions;
  background: SheetBackgroundConfig;
}
