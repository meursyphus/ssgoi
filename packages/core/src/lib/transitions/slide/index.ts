import type { SsgoiPathTransition } from "@types";
import { createOrderedPathTransitions } from "../utils";
import { slide as transition } from "./transition";

export type SlideConfig = {
  paths: readonly string[];
};

export function slide({ paths }: SlideConfig): SsgoiPathTransition[] {
  return createOrderedPathTransitions(
    paths,
    { forward: "left", backward: "right" },
    (direction) => transition({ direction }),
  );
}
