import type { HeroPrepareCtx, HeroStrategy } from "../../types";

/**
 * Chrome handling for `type: "static"`.
 *
 * The outgoing page snaps invisible the moment the transition starts. The
 * shared tile morph is handled by the always-on clone strategy; non-hero
 * chrome on the incoming page appears instantly in its final state.
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
