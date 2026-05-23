import { IntegratorProvider, WebAnimation } from "../../../animation";
import type { Animation } from "../../../animation";
import type { HeroContributeCtx, HeroStrategy } from "../types";

/**
 * Chrome handling for `type: "fade"`.
 *
 * Page chrome is treated as the page itself: the outgoing page fades out as a
 * whole surface, and the incoming page fades in as a whole surface. The shared
 * element morph is handled by CloneTileStrategy, which runs above both pages.
 */
class PageCrossfadeChromeStrategy implements HeroStrategy {
  contribute(ctx: HeroContributeCtx): Animation[] {
    const { from, to, physics, onComplete } = ctx;

    const previousFromOpacity = from.style.opacity;
    const previousToOpacity = to.style.opacity;
    const previousFromWillChange = from.style.willChange;
    const previousToWillChange = to.style.willChange;

    to.style.opacity = "0";
    from.style.willChange = "opacity";
    to.style.willChange = "opacity";

    onComplete(() => {
      from.style.opacity = previousFromOpacity;
      to.style.opacity = previousToOpacity;
      from.style.willChange = previousFromWillChange;
      to.style.willChange = previousToWillChange;
    });

    return [
      new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physics),
        style: (_t, u) => ({ opacity: u }),
      }),
      new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physics),
        style: (t) => ({ opacity: t }),
      }),
    ];
  }
}

export const createFadeChromeStrategy = (): HeroStrategy =>
  new PageCrossfadeChromeStrategy();
