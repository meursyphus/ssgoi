import type { Animation } from "../../../../animation";
import type {
  HeroContributeCtx,
  HeroPrepareCtx,
  HeroStrategy,
} from "../../types";

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
  private previousFromOpacity = "";

  prepare(ctx: HeroPrepareCtx): void {
    ctx.from.then((el) => {
      this.previousFromOpacity = el.style.opacity;
      el.style.opacity = "0";
    });
  }

  contribute(ctx: HeroContributeCtx): Animation[] {
    // `from` is the real outgoing node and gets re-shown on the next
    // navigation (React Activity / Next cacheComponents), so restore the
    // opacity we snapped to "0" in `prepare` — otherwise the reused page
    // stays invisible.
    ctx.onComplete(() => {
      ctx.from.style.opacity = this.previousFromOpacity;
    });
    return [];
  }
}

export const createStaticChromeStrategy = (): HeroStrategy =>
  new SnapHideChromeStrategy();
