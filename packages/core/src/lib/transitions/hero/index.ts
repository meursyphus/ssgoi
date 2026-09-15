import type { PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { type PresetConfig } from "../utils";
import { hero as transition } from "./transition";
import type { HeroOptions, HeroType, HeroVariant } from "./types";

export type { HeroOptions, HeroType, HeroVariant } from "./types";

/**
 * Hero preset configuration.
 *
 * - `type: "static"` (default) — morph the actual destination visual in place;
 *   incoming page content appears immediately.
 * - `type: "fade"` — fade the outgoing page and incoming non-shared content
 *   and surface colors. The image remains in its authored stacking context.
 * - `variant: "smooth"` — use a softer follower spring for the morph.
 * Both types crossfade a source copy with the real destination visual.
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
