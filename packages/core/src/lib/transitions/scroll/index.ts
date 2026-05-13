import type { SsgoiPathTransition } from "@types";
import { createOrderedPathTransitions } from "../utils";
import { scroll as transition } from "./transition";

export type ScrollConfig = {
  paths: readonly string[];
};

export function scroll({ paths }: ScrollConfig): SsgoiPathTransition[] {
  return createOrderedPathTransitions(
    paths,
    { forward: "up", backward: "down" },
    (direction) => transition({ direction }),
  );
}
