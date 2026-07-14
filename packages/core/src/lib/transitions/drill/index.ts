import type { SsgoiDirectionTransition, SsgoiPathTransition } from "@types";
import {
  createDirectionalPathTransitions,
  createDirectionalTransitions,
  type DirectionalTransitionPaths,
  type NavigationDirectionMotionMap,
} from "../utils";
import { drill as transition } from "./transition";
import type { DrillDirection, DrillType as InternalDrillType } from "./types";

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
 * Example: `drill({ enter: "/list", exit: "/detail", type: "slide" })`.
 * Kept here only for backward compatibility — will be removed in a future major.
 */
export type DrillTypeDeprecated = "crossfade";

type DrillAppearanceConfig =
  | {
      type?: "parallax";
      variant?: "default";
      options?: Record<string, never>;
    }
  | { type: "slide"; variant?: "default"; options?: Record<string, never> };

type DrillPathAppearanceConfig =
  | DrillAppearanceConfig
  | {
      /**
       * @deprecated Do not use in new code. v6 only supports `{ type, variant, options }`.
       * Migrate `type: "crossfade"` to `type: "slide"` — same behavior, new name.
       * Example: `drill({ enter: "/list", exit: "/detail", type: "slide" })`.
       * Kept here only for backward compatibility — will be removed in a future major.
       */
      type: "crossfade";
      variant?: "default";
      options?: Record<string, never>;
    };

export type DrillPathConfig = DirectionalTransitionPaths &
  DrillPathAppearanceConfig & {
    directions?: never;
  };

/** Selects a drill motion for each application-defined direction token. */
export type DrillDirectionConfig = DrillAppearanceConfig & {
  directions: NavigationDirectionMotionMap<DrillDirection>;
  enter?: never;
  exit?: never;
};

export type DrillConfig = DrillPathConfig | DrillDirectionConfig;

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

export function drill(config: DrillPathConfig): SsgoiPathTransition[];
export function drill(config: DrillDirectionConfig): SsgoiDirectionTransition[];
export function drill(
  config: DrillConfig,
): SsgoiPathTransition[] | SsgoiDirectionTransition[];
export function drill(
  config: DrillConfig,
): SsgoiPathTransition[] | SsgoiDirectionTransition[] {
  const type = (config as { type?: DrillType | DrillTypeDeprecated }).type;
  // `variant` / `options` are accepted in the public schema for forward
  // compatibility but currently have no implemented values to forward.
  const internalType = resolveInternalType(type);

  if (config.directions !== undefined) {
    return createDirectionalTransitions(config.directions, (direction) =>
      transition({ direction, type: internalType }),
    );
  }

  return createDirectionalPathTransitions(
    { enter: config.enter, exit: config.exit },
    (direction) => transition({ direction, type: internalType }),
  );
}
