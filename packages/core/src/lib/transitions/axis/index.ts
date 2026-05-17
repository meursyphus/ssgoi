import type { SsgoiPathTransition } from "@types";
import { createOrderedPathTransitions } from "../utils";
import { axis as transition } from "./transition";

// Note: the underlying transition/provider supports y/z too, but only x is
// exposed publicly right now — y/z haven't been UX-verified yet and we don't
// want to ship a type union that promises more than is polished.
export type AxisConfig = {
  paths: readonly string[];
  type?: "x";
};

export function axis({ paths }: AxisConfig): SsgoiPathTransition[] {
  return createOrderedPathTransitions(
    paths,
    { forward: "forward", backward: "backward" },
    (direction) => transition({ type: "x", direction }),
  );
}
