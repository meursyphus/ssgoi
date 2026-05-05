import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { hero as transition } from "./transition";

export function hero(paths: readonly string[]): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
