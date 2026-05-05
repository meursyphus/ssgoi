import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { film as transition, type FilmOptions } from "./transition";

export function film(
  paths: readonly string[],
  options?: FilmOptions,
): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition(options));
}

export type { FilmOptions };
