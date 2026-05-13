import type { SsgoiPathTransition } from "@types";
import {
  createDirectionalPathTransitions,
  type DirectionalTransitionPaths,
} from "../utils";
import { drill as transition } from "./transition";

export type DrillConfig = DirectionalTransitionPaths;

export function drill(config: DrillConfig): SsgoiPathTransition[] {
  return createDirectionalPathTransitions(config, (direction) =>
    transition({ direction }),
  );
}
