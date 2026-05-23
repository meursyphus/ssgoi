import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions, type PresetConfig } from "../utils";
import { rotate as transition } from "./transition";
import type { RotateOptions, RotateVariant } from "./types";

export type { RotateOptions, RotateVariant } from "./types";

/**
 * Rotate preset configuration.
 *
 * Single-behavior preset: no `type` discriminator. The unified
 * `{ variant, options }` slots are exposed for v6 schema consistency.
 */
export type RotateConfig = PresetConfig<
  { paths: readonly string[] },
  never,
  RotateVariant,
  RotateOptions
>;

export function rotate(config: RotateConfig): SsgoiPathTransition[] {
  const { paths } = config;
  return createSymmetricPathTransitions(paths, () => transition());
}
