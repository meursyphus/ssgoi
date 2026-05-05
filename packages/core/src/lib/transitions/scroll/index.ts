import type { SsgoiTransitionConfig } from "@types";
import { createOrderedPathTransitions } from "../utils";
import { scroll as transition } from "./transition";

export function scroll(paths: readonly string[]): SsgoiTransitionConfig[] {
  return createOrderedPathTransitions(
    paths,
    { forward: "up", backward: "down" },
    (direction) => transition({ direction }),
  );
}
