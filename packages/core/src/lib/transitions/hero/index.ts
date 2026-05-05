import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { hero as transition, type HeroOptions } from "./transition";

export function hero(
  paths: readonly string[],
  options?: HeroOptions,
): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition(options));
}

export type { HeroOptions };
