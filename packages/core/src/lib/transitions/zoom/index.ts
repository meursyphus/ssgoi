import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { zoom as transition } from "./transition";
import type {
  NormalizedZoomOptions,
  ZoomType,
  ZoomVariant,
} from "./types";

/**
 * Public config for the `zoom` preset (v6 unified `{type?, variant?, options?}`
 * surface). Only the implemented type × variant combinations are exposed in
 * the type so editors can drive completion without showing TODO branches.
 */
export type ZoomConfig = {
  paths: readonly string[];
  type?: ZoomType;
  variant?: ZoomVariant;
  // Reserved for future per-type knobs. Kept as an empty shape so call sites
  // can write `options: {}` today without churn when fields are added.
  options?: Record<string, never>;
  /**
   * @deprecated Do not use in new code. v6 only supports `{ type, variant, options }`.
   * Migrate `fade: true` to `variant: "fade"`.
   * Example: `zoom({ paths, type: "static", variant: "fade" })`.
   * Kept here only for backward compatibility — will be removed in a future major.
   */
  fade?: boolean;
};

/* ────────────────────────────────────────────────────────────────────────────
 * Normalization
 *
 * Single entry point that turns the public config + deprecated options into
 * the strict internal shape consumed by `transition.ts`. Doing this here
 * keeps the rest of the module free of legacy branches.
 * ──────────────────────────────────────────────────────────────────────────── */

function normalize(config: ZoomConfig): NormalizedZoomOptions {
  const type: ZoomType = config.type ?? "static";
  // Prefer the new `variant`; fall back to the deprecated `fade` boolean.
  // Both supplied together: `variant` wins.
  const variant: ZoomVariant =
    config.variant ?? (config.fade ? "fade" : "default");
  return { type, variant };
}

export function zoom(config: ZoomConfig): SsgoiPathTransition[] {
  const normalized = normalize(config);
  return createSymmetricPathTransitions(config.paths, () =>
    transition(normalized),
  );
}
