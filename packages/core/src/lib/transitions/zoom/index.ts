import type { PresetExtras } from "@types";
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
  const type: ZoomType = config.type ?? "static";
  const variant: ZoomVariant = config.variant ?? "default";
  return { type, variant };
}

export function zoom(
  config: ZoomConfig = {},
  extras: PresetExtras<ReturnType<typeof transition>> = {},
) {
  const normalized = normalize(config);
  return withOverride(transition(normalized), extras.override);
}
