import type { AnyTransitionConfig, PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { type PresetConfig } from "../utils";
import { rotate as transition } from "./transition";
import type { RotateOptions, RotateVariant } from "./types";

export type { RotateOptions, RotateVariant } from "./types";

/**
 * Rotate preset configuration.
 *
 * Single-behavior preset: no `type` discriminator. The unified
 * `{ variant, options }` slots are exposed for v6 schema consistency.
 */
export type RotateConfig = PresetConfig<never, RotateVariant, RotateOptions>;

export function rotate(
  _config: RotateConfig = {},
  extras: PresetExtras = {},
): AnyTransitionConfig {
  return withOverride(transition(), extras.override);
}
