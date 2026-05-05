import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { blind as transition, type BlindOptions } from "./transition";

export function blind(
  paths: readonly string[],
  options?: BlindOptions,
): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition(options));
}

export type { BlindOptions };
