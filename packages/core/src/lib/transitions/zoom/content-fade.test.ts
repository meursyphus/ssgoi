import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHROME_SPAN, chromeOpacity } from "../chrome-layer";
import { collectOverlappingContent, rectsOverlap } from "./content-fade";
import type { MediaRect } from "../media-geometry";

class Element {
  parentElement: Element | null = null;
  attributes: Record<string, string> = {};
  constructor(
    public box: MediaRect,
    public children: Element[] = [],
  ) {
    for (const child of children) child.parentElement = this;
  }
  getAttribute(name: string) {
    return this.attributes[name] ?? null;
  }
}

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): MediaRect => ({ left, top, width, height });
const measure = (element: Element) => element.box;

beforeEach(() => vi.stubGlobal("HTMLElement", Element));
afterEach(() => vi.unstubAllGlobals());

describe("chromeOpacity", () => {
  it("shows a page's overlays only in the last part of the move toward it", () => {
    expect(chromeOpacity(0)).toBe(0);
    expect(chromeOpacity(1 - CHROME_SPAN)).toBe(0);
    expect(chromeOpacity(1 - CHROME_SPAN / 2)).toBeCloseTo(0.5);
    expect(chromeOpacity(1)).toBe(1);
    // A spring overshoot never pushes past the authored range.
    expect(chromeOpacity(1.05)).toBe(1);
    expect(chromeOpacity(-0.05)).toBe(0);
  });
});

describe("rectsOverlap", () => {
  it("needs a real overlap, not a shared edge", () => {
    expect(rectsOverlap(rect(0, 0, 100, 100), rect(50, 50, 100, 100))).toBe(
      true,
    );
    expect(rectsOverlap(rect(0, 0, 100, 100), rect(0, 100, 100, 40))).toBe(
      false,
    );
    expect(rectsOverlap(rect(0, 0, 100, 100), rect(0, 99.8, 100, 40))).toBe(
      false,
    );
  });
});

describe("collectOverlappingContent", () => {
  it("keeps only the siblings drawn over the shared visual", () => {
    const image = new Element(rect(0, 0, 400, 240));
    const scrim = new Element(rect(0, 180, 400, 60));
    const control = new Element(rect(170, 90, 60, 60));
    const player = new Element(rect(0, 0, 400, 240), [image, scrim, control]);
    const title = new Element(rect(0, 240, 400, 48));
    const page = new Element(rect(0, 0, 400, 800), [player, title]);

    const targets = collectOverlappingContent(
      page as unknown as HTMLElement,
      [image as unknown as HTMLElement],
      image.box,
      measure as unknown as (element: HTMLElement) => MediaRect,
    );
    expect(targets).toEqual([scrim, control]);
  });

  it("looks through a sizeless wrapper to the controls it positions", () => {
    const image = new Element(rect(0, 0, 400, 240));
    const glyph = new Element(rect(180, 100, 40, 40));
    const anchor = new Element(rect(0, 240, 400, 0), [glyph]);
    const caption = new Element(rect(0, 240, 400, 0), [
      new Element(rect(0, 240, 400, 20)),
    ]);
    const page = new Element(rect(0, 0, 400, 800), [image, anchor, caption]);

    const targets = collectOverlappingContent(
      page as unknown as HTMLElement,
      [image as unknown as HTMLElement],
      image.box,
      measure as unknown as (element: HTMLElement) => MediaRect,
    );
    expect(targets).toEqual([glyph]);
  });

  it("never fades a crossfade copy next to the visual", () => {
    const image = new Element(rect(0, 0, 400, 240));
    const copy = new Element(rect(0, 0, 400, 240));
    copy.attributes["data-ssgoi-crossfade"] = "";
    const control = new Element(rect(170, 90, 60, 60));
    const page = new Element(rect(0, 0, 400, 800), [image, copy, control]);

    const targets = collectOverlappingContent(
      page as unknown as HTMLElement,
      [image as unknown as HTMLElement],
      image.box,
      measure as unknown as (element: HTMLElement) => MediaRect,
    );
    expect(targets).toEqual([control]);
  });
});
