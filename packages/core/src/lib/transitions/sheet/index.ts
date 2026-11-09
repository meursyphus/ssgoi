import type { PresetExtras } from "@types";
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

export type SheetConfig =
  | { type?: "static"; variant?: "default"; options?: Record<string, never> }
  | { type: "scale"; variant?: "default"; options?: Record<string, never> }
  | { type: "blur"; variant?: "default"; options?: Record<string, never> };

/** Map the public `type` value to the internal provider key. */
function resolveInternalType(type: SheetType | undefined): InternalSheetType {
  if (type === "scale") return "background-scale";
  if (type === "blur") return "blur";
  return "static";
}

export function sheet(
  config: SheetConfig = {},
  extras: PresetExtras<ReturnType<typeof transition>> = {},
) {
  const type = (config as { type?: SheetType }).type;
  // `variant` / `options` are accepted in the public schema for forward
  // compatibility but currently have no implemented values to forward.
  const internalType = resolveInternalType(type);

  return withOverride(transition({ type: internalType }), extras.override);
}
