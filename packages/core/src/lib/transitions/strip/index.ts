import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { strip as transition } from "./transition";

export type StripConfig = {
  paths: readonly string[];
};

export function strip({ paths }: StripConfig): SsgoiPathTransition[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
