import type { AnyTransitionConfig, PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { zoom as transition } from "./transition";
import type { NormalizedZoomOptions, ZoomType, ZoomVariant } from "./types";

/**
 * Public config for the `zoom` preset (v6 unified `{type?, variant?, options?}`
 * surface). Only the implemented type × variant combinations are exposed in
 * the type so editors can drive completion without showing TODO branches.
 */
export type ZoomConfig = {
  type?: ZoomType;
  variant?: ZoomVariant;
  // Reserved for future per-type knobs. Kept as an empty shape so call sites
  // can write `options: {}` today without churn when fields are added.
  options?: Record<string, never>;
};

function normalize(config: ZoomConfig): NormalizedZoomOptions {
  return {
    type: config.type ?? "static",
    variant: config.variant ?? "default",
  };
}

export function zoom(
  config: ZoomConfig = {},
  extras: PresetExtras = {},
): AnyTransitionConfig {
  const normalized = normalize(config);
  // Tile, background and overlay all run on one spring (the background
  // shrinks toward the tile), so any override label patches the whole
  // composite.
  return withOverride(transition(normalized), extras.override, {
    coupled: true,
  });
}
