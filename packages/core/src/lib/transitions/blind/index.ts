import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { blind as transition } from "./transition";

export type BlindConfig = {
  paths: readonly string[];
};

export function blind({ paths }: BlindConfig): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
