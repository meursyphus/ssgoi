import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions, type PresetConfig } from "../utils";
import { film as transition } from "./transition";
import type { FilmOptions, FilmVariant } from "./types";

export type { FilmOptions, FilmVariant } from "./types";

/**
 * Film preset configuration.
 *
 * Single-behavior preset: no `type` discriminator. `options.borderColor`
 * surfaces the cinematic corner-border color (previously a hard-coded
 * internal default).
 */
export type FilmConfig = PresetConfig<
  { paths: readonly string[] },
  never,
  FilmVariant,
  FilmOptions
>;

export function film(config: FilmConfig): SsgoiPathTransition[] {
  const { paths, options } = config;

  // Normalize public `options.borderColor` onto the internal transition's
  // `border.color` shape. Omitting `borderColor` leaves the internal
  // default in place (no override emitted).
  const innerOptions = options?.borderColor !== undefined
    ? { border: { color: options.borderColor } }
    : undefined;

  return createSymmetricPathTransitions(paths, () => transition(innerOptions));
}
