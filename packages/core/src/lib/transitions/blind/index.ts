import type { AnyTransitionConfig, PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { blind as transition } from "./transition";

/**
 * Public `type` values for `blind`. Maps to the internal `direction` axis:
 * - `"horizontal"` (default) — blinds open along the horizontal axis.
 * - `"vertical"` — blinds open along the vertical axis.
 */
export type BlindType = "horizontal" | "vertical";

export type BlindConfig = {
  type?: BlindType;
  variant?: "default";
  options?: object;
};

export function blind(
  config: BlindConfig = {},
  extras: PresetExtras = {},
): AnyTransitionConfig {
  const { type = "horizontal" } = config;
  // Internal `blind()` keys on `direction` (horizontal/vertical). The public
  // `type` slot is just a rename — the value space is identical. Slat count
  // and color stay on internal defaults; not exposed in v6 public surface.
  return withOverride(transition({ direction: type }), extras.override);
}
