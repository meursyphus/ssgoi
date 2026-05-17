import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { hero as transition } from "./transition";

export type HeroConfig = {
  paths: readonly string[];
};

export function hero({ paths }: HeroConfig): SsgoiPathTransition[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
