import type { SsgoiPathTransition } from "@types";
import {
  createDirectionalPathTransitions,
  type DirectionalTransitionPaths,
} from "../utils";
import { sheet as transition } from "./transition";

export type SheetConfig = DirectionalTransitionPaths;

export function sheet(config: SheetConfig): SsgoiPathTransition[] {
  return createDirectionalPathTransitions(config, (direction) =>
    transition({ direction }),
  );
}
