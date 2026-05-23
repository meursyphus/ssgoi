import type { SsgoiPathTransition } from "@types";
import { createOrderedPathTransitions, type PresetConfig } from "../utils";
import { slide as transition } from "./transition";
import type { SlideOptions, SlideVariant } from "./types";

export type { SlideOptions, SlideVariant } from "./types";

/**
 * Slide preset configuration.
 *
 * Single-behavior preset: no `type` discriminator. The unified
 * `{ variant, options }` slots are exposed so callers can adopt the v6
 * schema consistently across presets.
 */
export type SlideConfig = PresetConfig<
  { paths: readonly string[] },
  never,
  SlideVariant,
  SlideOptions
>;

export function slide(config: SlideConfig): SsgoiPathTransition[] {
  // `variant`/`options` are reserved for future extension; currently no-op.
  const { paths } = config;

  return createOrderedPathTransitions(
    paths,
    { forward: "left", backward: "right" },
    (direction) => transition({ direction }),
  );
}
