import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { rotate as transition, type RotateOptions } from "./transition";

export function rotate(
  paths: readonly string[],
  options?: RotateOptions,
): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition(options));
}

export type { RotateOptions };
