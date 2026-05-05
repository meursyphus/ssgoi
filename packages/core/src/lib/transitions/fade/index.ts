import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { fade as transition } from "./transition";

export function fade(paths: readonly string[]): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
