import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions, type PresetConfig } from "../utils";
import { fade as transition } from "./transition";
import type { FadeOptions, FadeType, FadeVariant } from "./types";

export type { FadeOptions, FadeType, FadeVariant } from "./types";

/**
 * Fade preset configuration. Default `type` is `"fade-through"` —
 * sequential fade-out → fade-in.
 */
export type FadeConfig = PresetConfig<
  { paths: readonly string[] },
  FadeType,
  FadeVariant,
  FadeOptions
>;

export function fade(config: FadeConfig): SsgoiPathTransition[] {
  const { paths } = config;
  return createSymmetricPathTransitions(paths, () => transition());
}
