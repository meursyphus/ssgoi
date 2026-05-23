/**
 * Public option shapes for the rotate preset.
 *
 * Single-behavior preset (no `type` slot). Exposes the unified
 * `{ variant, options }` slots so callers can adopt the v6 schema.
 */

export type RotateVariant = "default";

export type RotateOptions = Record<string, never>;
