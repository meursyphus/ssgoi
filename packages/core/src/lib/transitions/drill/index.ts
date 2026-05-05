import type { SsgoiTransitionConfig } from "@types";
import {
  createDirectionalPathTransitions,
  type DirectionalTransitionPaths,
} from "../utils";
import { drill as transition, type DrillOptions } from "./transition";

export type DrillConfig = DirectionalTransitionPaths &
  Omit<DrillOptions, "direction">;

export function drill(config: DrillConfig): SsgoiTransitionConfig[] {
  const { enter, exit, ...options } = config;

  return createDirectionalPathTransitions({ enter, exit }, (direction) =>
    transition({ ...options, direction }),
  );
}

export type { DrillOptions };
