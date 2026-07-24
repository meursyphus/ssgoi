import type { AnyTransitionConfig } from "@types";
import { drill as transition } from "./transition";
import type { DrillType as InternalDrillType } from "./types";

/**
 * Public `type` values supported by `drill`.
 *
 * - `"parallax"` (default) — layered enter/exit with depth parallax.
 * - `"slide"` — flat cross-faded slide. This is the new name for the legacy
 *   `"crossfade"` value; the underlying behavior is unchanged.
 */
export type DrillType = "parallax" | "slide";

/**
 * Legacy public `type` value, kept for source compatibility only.
 *
 * @deprecated Do not use in new code. v6 only supports `{ type, variant, options }`.
 * Migrate `type: "crossfade"` to `type: "slide"` — same behavior, new name.
 * Example: `{ on: "/detail/**", transition: drill({ type: "slide" }) }`.
 * Kept here only for backward compatibility — will be removed in a future major.
 */
export type DrillTypeDeprecated = "crossfade";

export type DrillConfig =
  | {
      type?: "parallax";
      variant?: "default";
      options?: Record<string, never>;
    }
  | { type: "slide"; variant?: "default"; options?: Record<string, never> }
  | {
      /**
       * @deprecated Do not use in new code. v6 only supports `{ type, variant, options }`.
       * Migrate `type: "crossfade"` to `type: "slide"` — same behavior, new name.
       * Example: `drill({ type: "slide" })`.
       * Kept here only for backward compatibility — will be removed in a future major.
       */
      type: "crossfade";
      variant?: "default";
      options?: Record<string, never>;
    };

/**
 * Normalize the public `type` value to the internal provider key. The internal
 * provider map still uses `"crossfade"` as a key — we keep that name internally
 * so the provider / transition code stays untouched, and only the public name
 * changed to `"slide"`.
 */
function resolveInternalType(
  type: DrillType | DrillTypeDeprecated | undefined,
): InternalDrillType {
  if (type === "slide") return "crossfade";
  if (type === "crossfade") return "crossfade";
  return "parallax";
}

export function drill(config: DrillConfig = {}): AnyTransitionConfig {
  const type = (config as { type?: DrillType | DrillTypeDeprecated }).type;
  // `variant` / `options` are accepted in the public schema for forward
  // compatibility but currently have no implemented values to forward.
  const internalType = resolveInternalType(type);

  return transition({ type: internalType });
}
