/**
 * Public option shapes for the film preset.
 *
 * Single-behavior preset (no `type` slot). Exposes a single tunable knob:
 * `options.borderColor` controls the cinematic corner-border color.
 */

export type FilmVariant = "default";

export interface FilmOptions {
  /**
   * Color of the cinematic corner borders.
   *
   * Defaults to the internal `DEFAULT_BORDER_COLOR` when omitted.
   */
  borderColor?: string;
}
