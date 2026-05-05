import type { SsgoiTransitionConfig } from "@types";
import { createOrderedPathTransitions } from "../utils";
import { slide as transition } from "./transition";

export function slide(paths: readonly string[]): SsgoiTransitionConfig[] {
  return createOrderedPathTransitions(
    paths,
    { forward: "left", backward: "right" },
    (direction) => transition({ direction }),
  );
}
