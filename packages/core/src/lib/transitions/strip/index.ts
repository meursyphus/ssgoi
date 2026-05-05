import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { strip as transition } from "./transition";

export function strip(paths: readonly string[]): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
