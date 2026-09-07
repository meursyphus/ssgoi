import type { AnyTransitionConfig, PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { axis as transition } from "./transition";
import type { AxisFeel, AxisType } from "./types";

// `variant` is an orthogonal dimension to `type`. Per axis:
//   x:
//     - omit (default) — Flutter SharedAxisTransition "fluid": relaxed,
//       ~300 ms, 30 px slide on both sides, sequential fade-through.
//     - "snappy" — KakaoTalk-style tab swap: tight, ~160 ms, 8 px slide on the
//       incoming side only, parallel cross-fade.
//   y:
//     - omit (default) — directional fade-through: forward goes bottom→top
//       (out exits up, in rises from below), 8 px slide, sequence composition.
//     - "non-directional" — overlapping cross-fade where the incoming side
//       always rises from below; outgoing fades in place without translating.
//       Use when navigation isn't a forward/backward pair.
//   z: snappy only — no `variant` slot.

/**
 * Public `variant` value for `axis({ type: "x" })`.
 *
 * - `"default"` — relaxed, fluid feel (Flutter SharedAxisTransition style).
 * - `"snappy"` — tight, decisive page swap (KakaoTalk style).
 */
export type AxisXVariant = "default" | "snappy";

/**
 * Public `variant` value for `axis({ type: "y" })`.
 *
 * - `"default"` — directional fade-through. Forward = bottom→top.
 * - `"non-directional"` — direction-agnostic cross-fade. Incoming always
 *   rises from below; outgoing fades in place.
 */
export type AxisYVariant = "default" | "non-directional";

export type AxisConfig =
  | { type?: "x"; variant?: AxisXVariant; options?: Record<string, never> }
  | { type: "y"; variant?: AxisYVariant; options?: Record<string, never> }
  | { type: "z"; variant?: "default"; options?: Record<string, never> };

/**
 * Resolve the public `{ type, variant }` pair into the internal `feel` value
 * accepted by the underlying transition. The transition still keys on `feel`,
 * so the transition / provider code stays untouched.
 *
 * For y/z, only the snappy provider exists today (`resolveAxisProvider` falls
 * back to snappy if fluid is requested), so we always send `"snappy"` to make
 * intent explicit.
 */
function resolveInternalFeel(
  type: AxisType,
  variant: string | undefined,
): AxisFeel {
  if (type === "y") {
    return variant === "non-directional" ? "non-directional" : "directional";
  }
  if (type !== "x") return "snappy";
  return variant === "snappy" ? "snappy" : "fluid";
}

export function axis(
  config: AxisConfig = {},
  extras: PresetExtras = {},
): AnyTransitionConfig {
  const type: AxisType = config.type ?? "x";
  const internalFeel = resolveInternalFeel(type, config.variant);
  return withOverride(
    transition({ type, feel: internalFeel }),
    extras.override,
  );
}
