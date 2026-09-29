import {
  IntegratorProvider,
  WebAnimation,
  type Animation,
} from "../../animation";
import {
  TEMPORARY_SELECTOR,
  buildChromeLayer,
  chromeOpacity,
} from "../chrome-layer";
import { Z_FOREGROUND } from "../stacking";
import { buildTileGeometry } from "./zoom-element";
import type { ZoomContributeCtx, ZoomStrategy } from "./types";

/**
 * The zoom tile is a whole page raised above the other page, so the other
 * page's chrome over the shared element's slot is covered for the whole run
 * and would pop in (exit) or out (enter) when the tile settles. Its copies
 * ride in a layer above the tile that follows the background page's
 * transform (see `../chrome-layer`), fading in as the tile shrinks home and
 * out as it grows.
 */
export class ChromeStrategy implements ZoomStrategy {
  readonly name = "chrome";

  contribute(ctx: ZoomContributeCtx): Animation[] {
    const { from, to, resolved, input, physics, context, onDispose } = ctx;
    if (typeof document === "undefined" || !from.contains || !to.contains)
      return [];
    const exiting = resolved.mode === "exit";
    const tile = exiting ? from : to;
    const background = exiting ? to : from;
    // The tile ends on the same visual the crossfade copies, so chrome is
    // whatever the background paints over that visual — not over a keyed
    // wrapper whose own children travel with the copy.
    const geometry = buildTileGeometry(input);
    const shared = geometry.contentAware
      ? (input.exitMedia?.mediaElement ?? resolved.exitEl)
      : resolved.exitEl;
    const motion = ctx.backgroundMotion;
    const layer = buildChromeLayer({
      page: background,
      shared,
      ignore: (element) =>
        tile.contains(element) || element.closest(TEMPORARY_SELECTOR) !== null,
      positionedParent: context.positionedParent,
      // Above the tile and above a shared-image copy that rides outside it.
      zIndex: String(Number(Z_FOREGROUND) + 2),
      transformOrigin: motion?.transformOrigin,
    });
    if (!layer) return [];

    // Exit: the copies fade in over the shrinking tile and match the real
    // chrome exactly when it lands. Enter: they start as the untouched page
    // looked and dissolve as the tile grows over them.
    const style = (t: number, u: number) => ({
      ...(motion?.style(t, u) ?? {}),
      opacity: chromeOpacity(exiting ? t : u),
    });
    Object.assign(layer.style, style(0, 1));
    context.positionedParent.appendChild(layer);
    onDispose(() => layer.remove());

    return [
      new WebAnimation({
        element: layer,
        motion: { lifetime: "temporary", role: "chrome" },
        integrator: IntegratorProvider.from(physics),
        style,
      }),
    ];
  }
}
