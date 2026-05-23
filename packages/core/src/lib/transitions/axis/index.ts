import type { SsgoiPathTransition } from "@types";
import { createOrderedPathTransitions } from "../utils";
import { axis as transition } from "./transition";
import type { AxisFeel, AxisType } from "./types";

// Note: the underlying transition/provider supports y/z too, but only x is
// exposed publicly right now — y/z haven't been UX-verified yet and we don't
// want to ship a type union that promises more than is polished.
//
// `variant` is an orthogonal dimension to `type`. For x:
//   - omit (default) — Flutter SharedAxisTransition-style "fluid": relaxed,
//     ~300 ms, 30 px slide on both sides, fade-through with asymmetric easings.
//   - `"snappy"` — KakaoTalk-style tab swap: tight, ~160 ms, 8 px slide on the
//     incoming side only, parallel cross-fade.
//
// y/z only ship the snappy flavor today; they expose no `variant` slot.

/**
 * Public `variant` value for `axis({ type: "x" })`.
 *
 * - `"default"` — relaxed, fluid feel (Flutter SharedAxisTransition style).
 * - `"snappy"` — tight, decisive page swap (KakaoTalk style).
 */
export type AxisXVariant = "default" | "snappy";

/**
 * Legacy `feel` axis. Kept for source compatibility only.
 *
 * @deprecated Do not use in new code. v6 only supports `{ type, variant, options }`.
 * Migrate `feel: "fluid"` → omit `variant` (default tone),
 * `feel: "snappy"` → `variant: "snappy"`.
 * Example: `axis({ paths, type: "x", variant: "snappy" })`.
 * Kept here only for backward compatibility — will be removed in a future major.
 */
export type AxisFeelDeprecated = "snappy" | "fluid";

export type AxisConfig = {
  paths: readonly string[];
} & (
  | {
      type?: "x";
      variant?: AxisXVariant;
      options?: {};
      /**
       * @deprecated Do not use in new code. v6 only supports `{ type, variant, options }`.
       * Migrate `feel: "fluid"` → omit `variant` (default tone),
       * `feel: "snappy"` → `variant: "snappy"`.
       * Example: `axis({ paths, type: "x", variant: "snappy" })`.
       * Kept here only for backward compatibility — will be removed in a future major.
       */
      feel?: AxisFeelDeprecated;
    }
  | { type: "y"; variant?: "default"; options?: {} }
  | { type: "z"; variant?: "default"; options?: {} }
);

/**
 * Resolve the public ({type, variant, feel}) tuple into the internal `feel`
 * value accepted by the underlying transition. The internal transition still
 * keys on `feel`, so the transition / provider code stays untouched.
 *
 * Public default for x (omitted variant) maps to internal `"fluid"` — this is
 * the intentional UX shift from the legacy internal default of `"snappy"`.
 * Legacy callers passing `feel: "snappy"` keep getting snappy.
 *
 * For y/z, only the snappy provider exists today (`resolveAxisProvider` falls
 * back to snappy if fluid is requested), so we always send `"snappy"` to make
 * intent explicit.
 */
function resolveInternalFeel(
  type: AxisType,
  variant: string | undefined,
  legacyFeel: AxisFeelDeprecated | undefined,
): AxisFeel {
  if (type !== "x") return "snappy";
  if (variant === "snappy") return "snappy";
  if (legacyFeel === "snappy") return "snappy";
  // variant is "default" / undefined and legacy feel is undefined or "fluid":
  // fall through to the new default tone.
  return "fluid";
}

export function axis(config: AxisConfig): SsgoiPathTransition[] {
  const { paths } = config;
  const type: AxisType = config.type ?? "x";
  const variant = (config as { variant?: string }).variant;
  const legacyFeel = (config as { feel?: AxisFeelDeprecated }).feel;
  const internalFeel = resolveInternalFeel(type, variant, legacyFeel);

  return createOrderedPathTransitions(
    paths,
    { forward: "forward", backward: "backward" },
    (direction) => transition({ type, direction, feel: internalFeel }),
  );
}
