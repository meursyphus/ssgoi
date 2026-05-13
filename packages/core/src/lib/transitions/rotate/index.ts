import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { rotate as transition } from "./transition";

export type RotateConfig = {
  paths: readonly string[];
};

export function rotate({ paths }: RotateConfig): SsgoiPathTransition[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
