import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { blind as transition } from "./transition";

export function blind(paths: readonly string[]): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
