import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { film as transition } from "./transition";

export function film(paths: readonly string[]): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
