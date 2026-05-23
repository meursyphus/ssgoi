import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions, type PresetConfig } from "../utils";
import { strip as transition } from "./transition";
import type { StripOptions, StripVariant } from "./types";

export type { StripOptions, StripVariant } from "./types";

/**
 * Strip preset configuration.
 *
 * Single-behavior preset: no `type` discriminator. The unified
 * `{ variant, options }` slots are exposed for consistency with other v6
 * presets.
 */
export type StripConfig = PresetConfig<
  { paths: readonly string[] },
  never,
  StripVariant,
  StripOptions
>;

export function strip(config: StripConfig): SsgoiPathTransition[] {
  const { paths } = config;
  return createSymmetricPathTransitions(paths, () => transition());
}
