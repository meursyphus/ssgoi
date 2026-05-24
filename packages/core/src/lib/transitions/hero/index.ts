import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions, type PresetConfig } from "../utils";
import { hero as transition } from "./transition";
import type { HeroOptions, HeroType, HeroVariant } from "./types";

export type { HeroOptions, HeroType, HeroVariant } from "./types";

/**
 * Hero preset configuration.
 *
 * - `type: "static"` (default) — incoming-page chrome snaps in; a temporary
 *   shared-element clone morphs via clip-path inset + uniform scale.
 * - `type: "fade"` — both pages cross-fade as whole surfaces while a
 *   temporary shared-element clone morphs above them. Use when each side has
 *   its own chrome (e.g., a detail screen with its own back button / app bar).
 * - `variant: "default"` — only value today; reserved for future tonal
 *   variants without re-shaping the public API.
 */
export type HeroConfig = PresetConfig<
  { paths: readonly string[] },
  HeroType,
  HeroVariant,
  HeroOptions
>;

export function hero(config: HeroConfig): SsgoiPathTransition[] {
  const { paths } = config;
  const type: HeroType = config.type ?? "static";
  const variant: HeroVariant = config.variant ?? "default";
  return createSymmetricPathTransitions(paths, () =>
    transition({ type, variant }),
  );
}
