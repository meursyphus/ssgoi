import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions, type PresetConfig } from "../utils";
import { hero as transition } from "./transition";
import type { HeroOptions, HeroVariant } from "./types";

export type { HeroOptions, HeroVariant } from "./types";

/**
 * Hero preset configuration.
 *
 * Single-behavior preset: no `type` discriminator. The unified
 * `{ variant, options }` slots are exposed. The `"snappy"` variant is
 * tracked on the TODO board and is intentionally not part of the public
 * type yet.
 */
export type HeroConfig = PresetConfig<
  { paths: readonly string[] },
  never,
  HeroVariant,
  HeroOptions
>;

export function hero(config: HeroConfig): SsgoiPathTransition[] {
  const { paths } = config;
  return createSymmetricPathTransitions(paths, () => transition());
}
