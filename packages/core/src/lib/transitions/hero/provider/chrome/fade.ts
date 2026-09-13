import { IntegratorProvider, WebAnimation } from "../../../../animation";
import type { AnimationContributions } from "../../../animation-group";
import { findMediaElement } from "../../../media-geometry";
import { collectContentTargets } from "../../content-targets";
import type {
  HeroAnimationName,
  HeroContributeCtx,
  HeroStrategy,
} from "../../types";

/**
 * Fade incoming sibling content like Zoom, leaving the in-page image and its
 * ancestors opaque. Ancestor surface colors fade separately so they cannot
 * dim the image or cover the outgoing page with an opaque background at t=0.
 */
class PageCrossfadeChromeStrategy implements HeroStrategy {
  contribute(
    ctx: HeroContributeCtx,
  ): AnimationContributions<HeroAnimationName> {
    const { from, to, resolved, physics, onDispose } = ctx;
    const visuals = resolved.pairs.map(
      (pair) => findMediaElement(pair.toEl) ?? pair.toEl,
    );
    const content = (
      visuals.length ? collectContentTargets(to, visuals) : [to]
    ).map((element) => ({
      element,
      opacity: element.style.opacity,
      willChange: element.style.willChange,
      targetOpacity: Number.parseFloat(getComputedStyle(element).opacity) || 0,
    }));
    const ancestors = new Set<HTMLElement>();
    for (const visual of visuals) {
      for (
        let current = visual.parentElement;
        current;
        current = current.parentElement
      ) {
        ancestors.add(current);
        if (current === to) break;
      }
    }
    const surfaces = Array.from(ancestors)
      .map((element) => ({
        element,
        color: getComputedStyle(element).backgroundColor,
        previousColor: element.style.backgroundColor,
      }))
      .filter(
        ({ color }) =>
          color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)",
      );

    const previousFromOpacity = from.style.opacity;
    const previousFromWillChange = from.style.willChange;
    from.style.willChange = "opacity";
    for (const { element } of content) {
      element.style.opacity = "0";
      element.style.willChange = "opacity";
    }
    for (const { element } of surfaces)
      element.style.backgroundColor = "transparent";

    // A newer navigation may already own a page or one of its content
    // targets; only restore what this run still owns.
    onDispose((disposal) => {
      if (disposal.owns(from)) {
        from.style.opacity = previousFromOpacity;
        from.style.willChange = previousFromWillChange;
      }
      for (const { element, opacity, willChange } of content) {
        if (!disposal.owns(element)) continue;
        element.style.opacity = opacity;
        element.style.willChange = willChange;
      }
      for (const { element, previousColor } of surfaces) {
        if (disposal.owns(element)) element.style.backgroundColor = previousColor;
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
        ...content.map(
          ({ element, targetOpacity }) =>
            new WebAnimation({
              element,
              integrator: IntegratorProvider.from(physics),
              style: (t) => ({
                opacity: Math.min(1, Math.max(0, t)) * targetOpacity,
              }),
            }),
        ),
        ...surfaces.map(
          ({ element, color }) =>
            new WebAnimation({
              element,
              integrator: IntegratorProvider.from(physics),
              style: (t) => ({
                backgroundColor: `color-mix(in srgb, ${color} ${Math.min(1, Math.max(0, t)) * 100}%, transparent)`,
              }),
            }),
        ),
      ],
    };
  }
}

export const createFadeChromeStrategy = (): HeroStrategy =>
  new PageCrossfadeChromeStrategy();
