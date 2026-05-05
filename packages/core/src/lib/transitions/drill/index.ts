import type { SsgoiTransitionConfig } from "@types";
import {
  createDirectionalPathTransitions,
  type DirectionalTransitionPaths,
} from "../utils";
import { drill as transition } from "./transition";

export type DrillConfig = DirectionalTransitionPaths;

export function drill(config: DrillConfig): SsgoiTransitionConfig[] {
  return createDirectionalPathTransitions(config, (direction) =>
    transition({ direction }),
  );
}
