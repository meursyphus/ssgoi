import type { AnyTransitionConfig, PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { type PresetConfig } from "../utils";
import { slide as transition } from "./transition";
import type { SlideOptions, SlideVariant } from "./types";

export type { SlideOptions, SlideVariant } from "./types";

/**
 * Slide preset configuration.
 *
 * Single-behavior preset: no `type` discriminator. The unified
 * `{ variant, options }` slots are exposed so callers can adopt the v6
 * schema consistently across presets.
 */
export type SlideConfig = PresetConfig<never, SlideVariant, SlideOptions>;

export function slide(
  _config: SlideConfig = {},
  extras: PresetExtras = {},
): AnyTransitionConfig {
  // `variant`/`options` are reserved for future extension; currently no-op.
  return withOverride(transition(), extras.override, { coupled: true });
}
