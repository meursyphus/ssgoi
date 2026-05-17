import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { fade as transition } from "./transition";

export type FadeConfig = {
  paths: readonly string[];
};

export function fade({ paths }: FadeConfig): SsgoiPathTransition[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
