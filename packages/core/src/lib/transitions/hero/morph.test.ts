import { afterEach, describe, expect, it, vi } from "vitest";
import { buildHeroMorphPlan, type HeroVisualReference } from "./transition";
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
  fit = "cover",
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
      objectFit: fit,
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

/** On-screen window and corner radii of a transformed, clip-pathed box. */
function shown(style: { transform: string; clipPath: string }, box: MediaRect) {
  const [tx, ty, sx, sy] = /translate\((.+)px, (.+)px\) scale\((.+), (.+)\)/
    .exec(style.transform)!
    .slice(1)
    .map(Number);
  const [top, right, bottom, left, rx, ry] =
    /inset\((\S+)% (\S+)% (\S+)% (\S+)% round (\S+)% .* \/ (\S+)%/
      .exec(style.clipPath)!
      .slice(1)
      .map(Number);
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;
  const x = (value: number) => cx + sx! * (value - cx) + tx!;
  const y = (value: number) => cy + sy! * (value - cy) + ty!;
  const x0 = x(box.left + (left! / 100) * box.width);
  const x1 = x(box.left + box.width - (right! / 100) * box.width);
  const y0 = y(box.top + (top! / 100) * box.height);
  const y1 = y(box.top + box.height - (bottom! / 100) * box.height);
  return [
    x0,
    y0,
    x1 - x0,
    y1 - y0,
    (rx! / 100) * box.width * sx!,
    (ry! / 100) * box.height * sy!,
  ];
}

function scene(
  fromBox: MediaRect,
  toBox: MediaRect,
  natural: [number, number],
  { fit = "cover", frame = false } = {},
) {
  const from = element(fromBox);
  const image = element(toBox, [], "visible", "0px", fit);
  for (const visual of [from, image])
    Object.assign(visual, {
      naturalWidth: natural[0],
      naturalHeight: natural[1],
    });
  // A rounded clipping frame around the destination image, like a gallery.
  const to = frame ? element(toBox, [image], "hidden", "16px") : image;
  const fromPage = element(new Rect(0, 0, 800, 800), [from]);
  const toPage = element(new Rect(0, 0, 800, 800), [to]);
  const root = element(new Rect(0, 0, 800, 800), [fromPage, toPage]);
  const plan = buildHeroMorphPlan(
    root,
    { key: "photo", fromEl: from, toEl: to, fromFit: "cover", toFit: "cover" },
    700,
    fromPage,
    toPage,
  )!;
  // The real destination keeps its box; the crossfade copy is sized to the
  // source content and placed at its parent's origin.
  const inPlace: HeroVisualReference = {
    box: plan.toVisualBox,
    scaleX: 1,
    scaleY: 1,
    content: plan.toContent,
  };
  const copy: HeroVisualReference = {
    box: new Rect(
      toBox.left,
      toBox.top,
      plan.fromContent.width,
      plan.fromContent.height,
    ),
    scaleX: 1,
    scaleY: 1,
  };
  return { plan, inPlace, copy };
}

afterEach(() => vi.unstubAllGlobals());

describe("hero clipped media morph", () => {
  it("finishes a portrait cover image at its original box without resizing", () => {
    vi.stubGlobal("DOMRect", Rect);
    const toBox = new Rect(50, 50, 400, 225);
    const { plan, inPlace } = scene(
      new Rect(20, 20, 320, 240),
      toBox,
      [800, 1200],
    );
    expect(plan.toVisualBox).toEqual({ ...toBox });
    expect(plan.toContent.height).toBe(600);
    const final = plan.styleFor(1, 0, inPlace);
    expect(final.transform).toBe("translate(0px, 0px) scale(1, 1)");
    expect(final.clipPath).toMatch(/^inset\(0% 0% 0% 0% round/);
    // Cover content above and below the box is outside the source crop too,
    // so the source window reaches past the image box at t=0.
    expect(plan.styleFor(0, 1, inPlace).clipPath).toMatch(/^inset\(-/);
  });

  it("letterboxes contain content inside the original box", () => {
    vi.stubGlobal("DOMRect", Rect);
    const toBox = new Rect(0, 0, 400, 800);
    const { plan, inPlace } = scene(
      new Rect(20, 20, 120, 120),
      toBox,
      [1600, 900],
      { fit: "contain" },
    );
    const [left, top, width, height] = shown(
      plan.styleFor(1, 0, inPlace),
      plan.toVisualBox,
    );
    expect([left, top, width, height]).toEqual([0, 287.5, 400, 225]);
    expect(plan.styleFor(1, 0, inPlace).transform).toBe(
      "translate(0px, 0px) scale(1, 1)",
    );
  });

  it.each([
    { natural: [800, 1200], fit: "cover", frame: false },
    { natural: [2400, 600], fit: "cover", frame: false },
    { natural: [1200, 1200], fit: "cover", frame: true },
    { natural: [1600, 900], fit: "contain", frame: false },
  ] as const)(
    "keeps the real image and the copy on one window ($natural $fit, frame: $frame)",
    ({ natural, fit, frame }) => {
      vi.stubGlobal("DOMRect", Rect);
      const fromBox = new Rect(30, 500, 160, 120);
      const toBox = new Rect(40, 60, 640, 360);
      const { plan, inPlace, copy } = scene(fromBox, toBox, [...natural], {
        fit,
        frame,
      });
      for (const t of [0, 0.25, 0.5, 0.75, 1, 1.08]) {
        const real = shown(plan.styleFor(t, 1 - t, inPlace), inPlace.box);
        const clone = shown(plan.styleFor(t, 1 - t, copy), copy.box);
        for (let i = 0; i < real.length; i++)
          expect(real[i]).toBeCloseTo(clone[i]!, 6);
        if (t === 0) {
          expect(real.slice(0, 4).map((v) => Number(v.toFixed(6)))).toEqual([
            30, 500, 160, 120,
          ]);
        }
        if (t === 1) {
          const window =
            fit === "contain"
              ? plan.toContent
              : { left: 40, top: 60, width: 640, height: 360 };
          expect(real.slice(0, 4).map((v) => Number(v.toFixed(6)))).toEqual([
            window.left,
            window.top,
            window.width,
            window.height,
          ]);
          expect(real[4]).toBeCloseTo(frame ? 16 : 0, 6);
        }
      }
    },
  );

  it.each([false, true])(
    "aligns different aspect ratios at both endpoints (reverse: %s)",
    (reverse) => {
      vi.stubGlobal("DOMRect", Rect);
      const thumbnail = element(new Rect(20, 30, 160, 120));
      const full = element(new Rect(50, 50, 400, 320));
      Object.assign(full, { naturalWidth: 60, naturalHeight: 80 });
      const from = reverse ? full : thumbnail;
      const to = reverse ? thumbnail : full;
      const fromPage = element(new Rect(0, 0, 800, 800), [from]);
      const toPage = element(new Rect(0, 0, 800, 800), [to]);
      const root = element(new Rect(0, 0, 800, 800), [fromPage, toPage]);
      const plan = buildHeroMorphPlan(
        root,
        {
          key: "photo",
          fromEl: from,
          toEl: to,
          fromFit: "cover",
          toFit: "cover",
        },
        700,
        fromPage,
        toPage,
      )!;
      for (const referenceBox of [plan.fromContent, plan.toContent]) {
        const reference = { box: referenceBox, scaleX: 1, scaleY: 1 };
        for (const t of [0, 1]) {
          const style = plan.styleFor(t, 1 - t, reference);
          const [, x, y, sx, sy] =
            /translate\((.*)px, (.*)px\) scale\((.*), (.*)\)/.exec(
              style.transform,
            )!;
          const expected =
            t === 0 ? from.getBoundingClientRect() : to.getBoundingClientRect();
          const width = referenceBox.width * Number(sx);
          const height = referenceBox.height * Number(sy);
          expect(width).toBeCloseTo(expected.width);
          expect(height).toBeCloseTo(expected.height);
          expect(
            referenceBox.left + referenceBox.width / 2 + Number(x) - width / 2,
          ).toBeCloseTo(expected.left);
          expect(
            referenceBox.top + referenceBox.height / 2 + Number(y) - height / 2,
          ).toBeCloseTo(expected.top);
        }
      }
    },
  );

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
