import type { SsgoiPathTransition } from "@types";
import {
  createDirectionalPathTransitions,
  type DirectionalTransitionPaths,
} from "../utils";
import { sheet as transition } from "./transition";
import type { SheetType } from "./types";

export type { SheetType } from "./types";

export type SheetConfig = DirectionalTransitionPaths & {
  type?: SheetType;
};

export function sheet({ type, ...paths }: SheetConfig): SsgoiPathTransition[] {
  return createDirectionalPathTransitions(paths, (direction) =>
    transition({ direction, type }),
  );
}
