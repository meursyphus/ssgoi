/**
 * Public option shapes for the hero preset.
 *
 * Single-behavior preset (no `type` slot). Exposes the unified
 * `{ variant, options }` slots.
 *
 * Not yet exposed (tracked separately on the TODO board):
 *   - `variant: "snappy"`
 */

export type HeroVariant = "default";

export type HeroOptions = Record<string, never>;
