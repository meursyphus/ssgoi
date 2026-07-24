import type { AnyTransitionConfig } from "@types";
import { type PresetConfig } from "../utils";
import { jaemin as transition } from "./transition";
import type { JaeminVariant } from "./types";

export type { JaeminVariant } from "./types";

/**
 * Jaemin preset configuration.
 *
 * Single-behavior preset: no `type` discriminator and no public `options`
 * (internal tuning constants are intentionally not exposed). The unified
 * `variant` slot is kept for v6 schema consistency.
 */
export type JaeminConfig = PresetConfig<never, JaeminVariant>;

export function jaemin(_config: JaeminConfig = {}): AnyTransitionConfig {
  return transition();
}
