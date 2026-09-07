import type { AnyTransitionConfig, PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { type PresetConfig } from "../utils";
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
export type StripConfig = PresetConfig<never, StripVariant, StripOptions>;

export function strip(
  _config: StripConfig = {},
  extras: PresetExtras = {},
): AnyTransitionConfig {
  return withOverride(transition(), extras.override);
}
