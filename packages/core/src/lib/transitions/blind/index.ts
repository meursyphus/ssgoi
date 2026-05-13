import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { blind as transition } from "./transition";

export type BlindConfig = {
  paths: readonly string[];
};

export function blind({ paths }: BlindConfig): SsgoiPathTransition[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
