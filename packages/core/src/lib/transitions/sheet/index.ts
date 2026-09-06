import type { AnyTransitionConfig, PresetExtras } from "@types";
import { withOverride } from "../../motion/with-override";
import { sheet as transition } from "./transition";
import type { SheetType as InternalSheetType } from "./types";

/**
 * Public `type` values supported by `sheet`.
 *
 * - `"static"` (default) — the background sits untouched while the sheet rises.
 * - `"scale"` — the background scales down slightly behind the rising sheet.
 * - `"blur"` — the background blurs and recedes (subtle scale + dim) behind the
 *   rising sheet, the way a modal pushes the page underneath out of focus.
 */
export type SheetType = "static" | "scale" | "blur";

export type SheetConfig = {
  type?: SheetType;
  variant?: "default";
  options?: Record<string, never>;
};

/**
 * Normalize the public `type` value to the internal provider key. The internal
 * provider map still uses `"background-scale"` — we keep that name internally
 * so the provider / transition code stays untouched.
 */
function resolveInternalType(type: SheetType | undefined): InternalSheetType {
  if (type === "scale") return "background-scale";
  if (type === "blur") return "blur";
  return "static";
}

export function sheet(
  config: SheetConfig = {},
  extras: PresetExtras = {},
): AnyTransitionConfig {
  // `variant` / `options` are accepted in the public schema for forward
  // compatibility but currently have no implemented values to forward.
  const internalType = resolveInternalType(config.type);
  // The sheet, its background and the blur overlay run on one spring (the
  // background recede is coupled to the sheet's travel), so any override
  // label patches the whole composite.
  return withOverride(transition({ type: internalType }), extras.override, {
    coupled: true,
  });
}
