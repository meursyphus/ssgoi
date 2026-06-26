import type { SsgoiPathTransition } from "@types";
import {
  createDirectionalPathTransitions,
  type DirectionalTransitionPaths,
} from "../utils";
import { sheet as transition } from "./transition";
import type { SheetType as InternalSheetType } from "./types";

/**
 * Public `type` values supported by `sheet`.
 *
 * - `"static"` (default) — the background sits untouched while the sheet rises.
 * - `"scale"` — the background scales down slightly behind the rising sheet.
 *   This is the new name for the legacy `"background-scale"` value; the
 *   underlying behavior is unchanged.
 * - `"blur"` — the background blurs and recedes (subtle scale + dim) behind the
 *   rising sheet, the way a modal pushes the page underneath out of focus.
 */
export type SheetType = "static" | "scale" | "blur";

/**
 * Legacy public `type` value, kept for source compatibility only.
 *
 * @deprecated Do not use in new code. v6 only supports `{ type, variant, options }`.
 * Migrate `type: "background-scale"` to `type: "scale"` — same behavior, new name.
 * Example: `sheet({ enter: "/list", exit: "/sheet", type: "scale" })`.
 * Kept here only for backward compatibility — will be removed in a future major.
 */
export type SheetTypeDeprecated = "background-scale";

export type SheetConfig = DirectionalTransitionPaths &
  (
    | { type?: "static"; variant?: "default"; options?: Record<string, never> }
    | { type: "scale"; variant?: "default"; options?: Record<string, never> }
    | { type: "blur"; variant?: "default"; options?: Record<string, never> }
    | {
        /**
         * @deprecated Do not use in new code. v6 only supports `{ type, variant, options }`.
         * Migrate `type: "background-scale"` to `type: "scale"` — same behavior, new name.
         * Example: `sheet({ enter: "/list", exit: "/sheet", type: "scale" })`.
         * Kept here only for backward compatibility — will be removed in a future major.
         */
        type: "background-scale";
        variant?: "default";
        options?: Record<string, never>;
      }
  );

/**
 * Normalize the public `type` value to the internal provider key. The internal
 * provider map still uses `"background-scale"` — we keep that name internally
 * so the provider / transition code stays untouched, and only the public name
 * changed to `"scale"`.
 */
function resolveInternalType(
  type: SheetType | SheetTypeDeprecated | undefined,
): InternalSheetType {
  if (type === "scale") return "background-scale";
  if (type === "background-scale") return "background-scale";
  if (type === "blur") return "blur";
  return "static";
}

export function sheet(config: SheetConfig): SsgoiPathTransition[] {
  const { enter, exit } = config;
  const type = (config as { type?: SheetType | SheetTypeDeprecated }).type;
  // `variant` / `options` are accepted in the public schema for forward
  // compatibility but currently have no implemented values to forward.
  const internalType = resolveInternalType(type);

  return createDirectionalPathTransitions({ enter, exit }, (direction) =>
    transition({ direction, type: internalType }),
  );
}
