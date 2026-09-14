import { IntegratorProvider, WebAnimation } from "../../../../animation";
import type { AnimationContributions } from "../../../animation-group";
import { findMediaElement } from "../../../media-geometry";
import type {
  HeroAnimationName,
  HeroContributeCtx,
  HeroStrategy,
} from "../../types";

/**
 * Chrome handling for `type: "fade"`.
 *
 * Page chrome is treated as the page itself: the outgoing page fades out as a
 * whole surface, and the incoming page fades in as a whole surface. Its
 * non-shared content also fades in independently, excluding every shared visual
 * and its ancestors. The always-on clone strategy keeps the shared image fully
 * visible above both pages. This applies to the destination in either direction.
 */

function collectContentTargets(
  page: HTMLElement,
  sharedElements: HTMLElement[],
): HTMLElement[] {
  const visuals = new Set(
    sharedElements.map((el) => findMediaElement(el) ?? el),
  );
  const ancestors = new Set<HTMLElement>();
  for (const visual of visuals) {
    let current = visual.parentElement;
    while (current && current !== page) {
      ancestors.add(current);
      current = current.parentElement;
    }
  }

  const targets: HTMLElement[] = [];
  const visit = (node: HTMLElement): void => {
    if (visuals.has(node)) return;
    if (node !== page && !ancestors.has(node)) {
      targets.push(node);
      return;
    }
    for (const child of Array.from(node.children)) {
      if (child instanceof HTMLElement) visit(child);
    }
  };
  visit(page);
  return targets;
}

class PageCrossfadeChromeStrategy implements HeroStrategy {
  contribute(
    ctx: HeroContributeCtx,
  ): AnimationContributions<HeroAnimationName> {
    const { from, to, resolved, physics, onComplete } = ctx;
    const content = collectContentTargets(
      to,
      resolved.pairs.map((pair) => pair.toEl),
    ).map((element) => ({
      element,
      opacity: element.style.opacity,
      willChange: element.style.willChange,
      targetOpacity: Number.parseFloat(getComputedStyle(element).opacity) || 0,
    }));

    const previousFromOpacity = from.style.opacity;
    const previousToOpacity = to.style.opacity;
    const previousFromWillChange = from.style.willChange;
    const previousToWillChange = to.style.willChange;

    to.style.opacity = "0";
    from.style.willChange = "opacity";
    to.style.willChange = "opacity";
    for (const { element } of content) {
      element.style.opacity = "0";
      element.style.willChange = "opacity";
    }

    onComplete(() => {
      from.style.opacity = previousFromOpacity;
      to.style.opacity = previousToOpacity;
      from.style.willChange = previousFromWillChange;
      to.style.willChange = previousToWillChange;
      for (const { element, opacity, willChange } of content) {
        element.style.opacity = opacity;
        element.style.willChange = willChange;
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
      ],
    };
  }
}

export const createFadeChromeStrategy = (): HeroStrategy =>
  new PageCrossfadeChromeStrategy();
