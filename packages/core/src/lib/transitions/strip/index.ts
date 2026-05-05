import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { strip as transition, type StripOptions } from "./transition";

export function strip(
  paths: readonly string[],
  options?: StripOptions,
): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition(options));
}

export type { StripOptions };
