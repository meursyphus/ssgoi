import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { jaemin as transition } from "./transition";

export type JaeminConfig = {
  paths: readonly string[];
};

export function jaemin({ paths }: JaeminConfig): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
