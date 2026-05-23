/**
 * Public option shapes for the fade preset.
 *
 * Default `type` is `"fade-through"` — the current sequential
 * fade-out → fade-in behavior.
 *
 * Not yet exposed (tracked separately on the TODO board):
 *   - `type: "cross-fade"` (simultaneous fade)
 *   - `variant: "smooth"`
 */

export type FadeType = "fade-through";

export type FadeVariant = "default";

export type FadeOptions = Record<string, never>;
