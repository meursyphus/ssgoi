import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { jaemin as transition, type JaeminOptions } from "./transition";

export function jaemin(
  paths: readonly string[],
  options?: JaeminOptions,
): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition(options));
}

export type { JaeminOptions };
