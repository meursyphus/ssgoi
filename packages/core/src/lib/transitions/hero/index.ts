import type { PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { type PresetConfig } from "../utils";
import { hero as transition } from "./transition";
import type { HeroOptions, HeroType, HeroVariant } from "./types";

export type { HeroOptions, HeroType, HeroVariant } from "./types";

/**
 * Hero preset configuration.
 *
 * - `type: "static"` (default) — morph the shared visual;
 *   incoming page content appears immediately.
 * - `type: "fade"` — fade the outgoing page and incoming non-shared content
 *   and surface colors. The shared visual stays opaque.
 * - `variant: "smooth"` — use a softer follower spring for the morph.
 * Enter animates in the destination's parent; exit uses a layer above both pages.
 * Ancestor overflow belongs to the application. The animated visual carries
 * `data-hero-transitioning` until completion for optional caller-owned CSS.
 */
export type HeroConfig = PresetConfig<HeroType, HeroVariant, HeroOptions>;

export function hero(
  config: HeroConfig = {},
  extras: PresetExtras<ReturnType<typeof transition>> = {},
) {
  const type: HeroType = config.type ?? "static";
  const variant: HeroVariant = config.variant ?? "default";
  return withOverride(transition({ type, variant }), extras.override);
}
