import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { fade as transition, type FadeOptions } from "./transition";

export function fade(
  paths: readonly string[],
  options?: FadeOptions,
): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition(options));
}

export type { FadeOptions };
