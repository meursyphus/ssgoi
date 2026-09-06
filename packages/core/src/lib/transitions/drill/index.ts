import type { AnyTransitionConfig, PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { drill as transition } from "./transition";
import type { DrillType as InternalDrillType } from "./types";

/**
 * Public `type` values supported by `drill`.
 *
 * - `"parallax"` (default) — layered enter/exit with depth parallax.
 * - `"slide"` — flat cross-faded slide.
 */
export type DrillType = "parallax" | "slide";

export type DrillConfig = {
  type?: DrillType;
  variant?: "default";
  options?: Record<string, never>;
};

/**
 * Normalize the public `type` value to the internal provider key. The internal
 * provider map still uses `"crossfade"` for the flat slide — we keep that name
 * internally so the provider / transition code stays untouched.
 */
function resolveInternalType(type: DrillType | undefined): InternalDrillType {
  return type === "slide" ? "crossfade" : "parallax";
}

export function drill(
  config: DrillConfig = {},
  extras: PresetExtras = {},
): AnyTransitionConfig {
  // `variant` / `options` are accepted in the public schema for forward
  // compatibility but currently have no implemented values to forward.
  const internalType = resolveInternalType(config.type);
  // Both pages share one spring (the parallax pair moves as one), so any
  // override label patches the whole composite.
  return withOverride(transition({ type: internalType }), extras.override, {
    coupled: true,
  });
}
