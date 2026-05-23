/**
 * Public option shapes for the strip preset.
 *
 * Single-behavior preset (no `type` slot). Exposes the unified
 * `{ variant, options }` slots so callers can adopt the v6 schema.
 */

export type StripVariant = "default";

export type StripOptions = Record<string, never>;
