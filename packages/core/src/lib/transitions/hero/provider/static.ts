import type { HeroPrepareCtx, HeroStrategy } from "../types";

/**
 * Chrome handling for `type: "static"`.
 *
 * The outgoing page snaps invisible the moment the transition starts — the
 * incoming page (which is what TileStrategy morphs the hero element on) does
 * all the visible work. Non-hero chrome on the incoming page appears
 * instantly in its final state.
 *
 * Equivalent to v5/v6 hero default behavior.
 */
class SnapHideChromeStrategy implements HeroStrategy {
  prepare(ctx: HeroPrepareCtx): void {
    ctx.from.then((el) => {
      el.style.opacity = "0";
    });
  }
}

export const createStaticChromeStrategy = (): HeroStrategy =>
  new SnapHideChromeStrategy();
