import { IntegratorProvider, WebAnimation } from "../../../../animation";
import type { AnimationContributions } from "../../../animation-group";
import type {
  HeroAnimationName,
  HeroContributeCtx,
  HeroStrategy,
} from "../../types";

/**
 * Chrome handling for `type: "fade"`.
 *
 * Page chrome is treated as the page itself: the outgoing page fades out as a
 * whole surface, and the incoming page fades in as a whole surface. The shared
 * element morph is handled by the always-on clone strategy, which runs above
 * both pages.
 */
class PageCrossfadeChromeStrategy implements HeroStrategy {
  contribute(
    ctx: HeroContributeCtx,
  ): AnimationContributions<HeroAnimationName> {
    const { from, to, physics, onDispose } = ctx;

    const previousFromOpacity = from.style.opacity;
    const previousToOpacity = to.style.opacity;
    const previousFromWillChange = from.style.willChange;
    const previousToWillChange = to.style.willChange;

    to.style.opacity = "0";
    from.style.willChange = "opacity";
    to.style.willChange = "opacity";

    onDispose((disposal) => {
      if (disposal.owns(from)) {
        from.style.opacity = previousFromOpacity;
        from.style.willChange = previousFromWillChange;
      }
      if (disposal.owns(to)) {
        to.style.opacity = previousToOpacity;
        to.style.willChange = previousToWillChange;
      }
    });

    return {
      out: [
        new WebAnimation({
          element: from,
          integrator: IntegratorProvider.from(physics),
          style: (_t, u) => ({ opacity: u }),
        }),
      ],
      in: [
        new WebAnimation({
          element: to,
          integrator: IntegratorProvider.from(physics),
          style: (t) => ({ opacity: t }),
        }),
      ],
    };
  }
}

export const createFadeChromeStrategy = (): HeroStrategy =>
  new PageCrossfadeChromeStrategy();
