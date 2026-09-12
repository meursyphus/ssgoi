import { afterEach, describe, expect, it, vi } from "vitest";
import { buildHeroMorphPlan } from "./transition";
import type { MediaRect } from "../media-geometry";

class Rect {
  constructor(
    public left = 0,
    public top = 0,
    public width = 0,
    public height = 0,
  ) {}
}

function element(
  box: MediaRect,
  children: HTMLElement[] = [],
  overflow = "visible",
  radius = "0px",
): HTMLElement {
  const el = {
    tagName: children.length ? "DIV" : "IMG",
    children,
    scrollLeft: 0,
    scrollTop: 0,
    naturalWidth: 100,
    naturalHeight: 100,
    offsetWidth: box.width,
    offsetHeight: box.height,
    getBoundingClientRect: () => box,
    getAttribute: () => null,
    style: {
      objectFit: "cover",
      objectPosition: "50% 50%",
      overflowX: overflow,
      overflowY: overflow,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomLeftRadius: radius,
      borderBottomRightRadius: radius,
    },
  } as unknown as HTMLElement;
  for (const child of children)
    Object.defineProperty(child, "parentElement", { value: el });
  return el;
}

afterEach(() => vi.unstubAllGlobals());

describe("hero clipped media morph", () => {
  it.each([false, true])(
    "preserves the scroller crop and corners (reverse: %s)",
    (reverse) => {
      vi.stubGlobal("DOMRect", Rect);
      const tileBox = new Rect(370, 330, 100, 100);
      const tile = element(tileBox, [element(tileBox)], "hidden", "16px");
      const viewport = element(new Rect(50, 50, 400, 700), [tile], "hidden");
      const list = element(new Rect(50, 50, 400, 800), [viewport]);
      const image = element(new Rect(50, 50, 400, 400));
      const detail = element(new Rect(50, 50, 400, 800), [image]);
      const root = element(new Rect(50, 50, 400, 800), [list, detail]);
      root.scrollTop = 100;
      const plan = buildHeroMorphPlan(
        root,
        {
          key: "photo",
          fromEl: reverse ? image : tile,
          toEl: reverse ? tile : image,
          fromFit: "cover",
          toFit: "cover",
        },
        700,
        reverse ? detail : list,
        reverse ? list : detail,
      );
      expect(plan).not.toBeNull();
      // Absolute clone coordinates include the positioned container's scroll.
      expect(plan?.toContent.top).toBe(reverse ? 380 : 100);
      expect(plan?.fromVisualEl.tagName).toBe("IMG");
      const clipped = reverse ? plan!.styleFor(1, 0) : plan!.styleFor(0, 1);
      expect(clipped.clipPath).toBe(
        reverse
          ? "inset(0px 20px 0px 0px round 16px 0px 0px 16px)"
          : "inset(0px 80px 0px 0px round 64px 0px 0px 64px)",
      );
    },
  );
});
