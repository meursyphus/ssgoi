import type { SsgoiTransitionConfig } from "@types";
import { createOrderedPathTransitions } from "../utils";
import { slide as transition } from "./transition";

export type SlideConfig = {
  paths: readonly string[];
};

export function slide({ paths }: SlideConfig): SsgoiTransitionConfig[] {
  return createOrderedPathTransitions(
    paths,
    { forward: "left", backward: "right" },
    (direction) => transition({ direction }),
  );
}
