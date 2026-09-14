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
  it("maps the real image's local box to the measured destination content", () => {
    vi.stubGlobal("DOMRect", Rect);
    const from = element(new Rect(20, 30, 100, 100));
    const to = element(new Rect(50, 50, 400, 400));
    const fromPage = element(new Rect(0, 0, 800, 800), [from]);
    const toPage = element(new Rect(0, 0, 800, 800), [to]);
    const root = element(new Rect(0, 0, 800, 800), [fromPage, toPage]);
    const plan = buildHeroMorphPlan(
      root,
      {
        key: "image",
        fromEl: from,
        toEl: to,
        fromFit: "cover",
        toFit: "cover",
      },
      700,
      fromPage,
      toPage,
    )!;
    const reference = { box: new Rect(0, 0, 400, 400), scaleX: 1, scaleY: 1 };
    expect(plan.styleFor(0, 1, reference).transform).toBe(
      "translate(-130px, -120px) scale(0.25, 0.25)",
    );
    expect(plan.styleFor(1, 0, reference).transform).toBe(
      "translate(50px, 50px) scale(1, 1)",
    );
    expect(
      plan.styleFor(1, 0, { ...reference, scaleX: 2, scaleY: 2 }).transform,
    ).toBe("translate(25px, 25px) scale(1, 1)");
  });

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
        "inset(0% 20% 0% 0% round 16% 0% 0% 16% / 16% 0% 0% 16%)",
      );
    },
  );
});
