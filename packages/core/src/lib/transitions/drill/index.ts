import type { SsgoiPathTransition } from "@types";
import {
  createDirectionalPathTransitions,
  type DirectionalTransitionPaths,
} from "../utils";
import { drill as transition } from "./transition";
import type { DrillType } from "./types";

export type { DrillType } from "./types";

export type DrillConfig = DirectionalTransitionPaths & {
  type?: DrillType;
};

export function drill({ type, ...paths }: DrillConfig): SsgoiPathTransition[] {
  return createDirectionalPathTransitions(paths, (direction) =>
    transition({ direction, type }),
  );
}
