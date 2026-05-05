import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { fade as transition } from "./transition";

export type FadeConfig = {
  paths: readonly string[];
};

export function fade({ paths }: FadeConfig): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
