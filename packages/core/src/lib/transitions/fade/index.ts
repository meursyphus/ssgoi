import type { AnyTransitionConfig, PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { type PresetConfig } from "../utils";
import { fade as transition } from "./transition";
import type { FadeOptions, FadeType, FadeVariant } from "./types";

export type { FadeOptions, FadeType, FadeVariant } from "./types";

/**
 * Fade preset configuration. Default `type` is `"fade-through"` —
 * sequential fade-out → fade-in.
 */
export type FadeConfig = PresetConfig<FadeType, FadeVariant, FadeOptions>;

export function fade(
  _config: FadeConfig = {},
  extras: PresetExtras = {},
): AnyTransitionConfig {
  return withOverride(transition(), extras.override);
}
