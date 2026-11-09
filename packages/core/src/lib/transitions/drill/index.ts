import type { PresetExtras } from "@types";
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

export type DrillConfig =
  | {
      type?: "parallax";
      variant?: "default";
      options?: Record<string, never>;
    }
  | { type: "slide"; variant?: "default"; options?: Record<string, never> };

/** Map the public `type` value to the internal provider key. */
function resolveInternalType(type: DrillType | undefined): InternalDrillType {
  return type === "slide" ? "crossfade" : "parallax";
}

export function drill(
  config: DrillConfig = {},
  extras: PresetExtras<ReturnType<typeof transition>> = {},
) {
  const type = (config as { type?: DrillType }).type;
  // `variant` / `options` are accepted in the public schema for forward
  // compatibility but currently have no implemented values to forward.
  const internalType = resolveInternalType(type);

  return withOverride(transition({ type: internalType }), extras.override);
}
