import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  gridPoints,
  outermost,
  siblingPoints,
  stackAbove,
} from "./chrome-layer";
import type { MediaRect } from "./media-geometry";

class Element {
  parentElement: Element | null = null;
  constructor(
    public name: string,
    public box: MediaRect = { left: 0, top: 0, width: 0, height: 0 },
    public children: Element[] = [],
  ) {
    for (const child of children) child.parentElement = this;
  }
  contains(other: Element): boolean {
    return (
      other === this || this.children.some((child) => child.contains(other))
    );
  }
}

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): MediaRect => ({ left, top, width, height });
const el = (element: Element) => element as unknown as HTMLElement;
const never = () => false;

beforeEach(() => vi.stubGlobal("HTMLElement", Element));
afterEach(() => vi.unstubAllGlobals());

describe("gridPoints", () => {
  it("spreads a bounded number of samples inside the box", () => {
    const points = gridPoints(rect(100, 200, 200, 120));
    expect(points).toHaveLength(5 * 3);
    for (const { x, y } of points) {
      expect(x).toBeGreaterThan(100);
      expect(x).toBeLessThan(300);
      expect(y).toBeGreaterThan(200);
      expect(y).toBeLessThan(320);
    }
    expect(gridPoints(rect(0, 0, 4000, 4000))).toHaveLength(36);
    expect(gridPoints(rect(0, 0, 10, 10))).toHaveLength(1);
  });
});

describe("siblingPoints", () => {
  it("samples the centre of every overlapping sibling up the chain", () => {
    const image = new Element("img", rect(100, 220, 200, 120));
    const badge = new Element("badge", rect(256, 224, 40, 20));
    const card = new Element("card", rect(100, 220, 200, 120), [image, badge]);
    const other = new Element("other", rect(100, 40, 200, 120));
    const bar = new Element("bar", rect(0, 320, 400, 80));
    const page = new Element("page", rect(0, 0, 400, 400), [card, other, bar]);

    const points = siblingPoints(
      el(page),
      el(image),
      image.box,
      (element) => (element as unknown as Element).box,
      never,
    );
    expect(points).toEqual([
      { x: 276, y: 234 },
      { x: 200, y: 330 },
    ]);
  });
});

describe("stackAbove", () => {
  const image = new Element("img");
  const badge = new Element("badge");
  const card = new Element("card", undefined, [image, badge]);
  const label = new Element("label");
  const link = new Element("link", undefined, [label]);
  const bar = new Element("bar", undefined, [link]);
  const page = new Element("page", undefined, [card, bar]);
  const tileControl = new Element("control");
  const tile = new Element("tile", undefined, [tileControl]);
  new Element("scene", undefined, [page, tile]);

  it("returns everything of the page painted between the top and the visual", () => {
    const stack = [tileControl, tile, label, link, bar, image, card, page];
    expect(
      stackAbove(stack.map(el), el(page), el(image), (element) =>
        tile.contains(element as unknown as Element),
      ),
    ).toEqual([label, link, bar]);
  });

  it("ignores ancestors of the visual and reports nothing when it is not hit", () => {
    expect(
      stackAbove([card, page].map(el), el(page), el(image), never),
    ).toEqual([]);
    expect(
      stackAbove([badge, card, page].map(el), el(page), el(image), never),
    ).toEqual([]);
  });
});

describe("outermost", () => {
  it("drops elements whose ancestor is also present", () => {
    const label = new Element("label");
    const link = new Element("link", undefined, [label]);
    const bar = new Element("bar", undefined, [link]);
    const badge = new Element("badge");
    expect(outermost([label, badge, link, bar, label].map(el))).toEqual(
      [badge, bar].map(el),
    );
  });
});
