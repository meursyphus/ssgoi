import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { strip as transition } from "./transition";

export type StripConfig = {
  paths: readonly string[];
};

export function strip({ paths }: StripConfig): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
