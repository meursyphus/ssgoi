import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { film as transition } from "./transition";

export type FilmConfig = {
  paths: readonly string[];
};

export function film({ paths }: FilmConfig): SsgoiPathTransition[] {
  return createSymmetricPathTransitions(paths, () => transition());
}
