/**
 * Public option shapes for the slide preset.
 *
 * The slide preset has no `type` discriminator (single behavior). It still
 * exposes the unified `{ variant, options }` slots so callers can adopt the
 * v6 schema uniformly across presets.
 */

export type SlideVariant = "default";

export type SlideOptions = Record<string, never>;
