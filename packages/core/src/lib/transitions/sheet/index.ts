import type { SsgoiTransitionConfig } from "@types";
import {
  createDirectionalPathTransitions,
  type DirectionalTransitionPaths,
} from "../utils";
import { sheet as transition, type SheetOptions } from "./transition";

export type SheetConfig = DirectionalTransitionPaths &
  Omit<SheetOptions, "direction">;

export function sheet(config: SheetConfig): SsgoiTransitionConfig[] {
  const { enter, exit, ...options } = config;

  return createDirectionalPathTransitions({ enter, exit }, (direction) =>
    transition({ ...options, direction }),
  );
}

export type { SheetOptions };
