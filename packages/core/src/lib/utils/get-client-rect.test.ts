import { afterEach, describe, expect, it, vi } from "vitest";
import { getClientRect } from "./get-client-rect";

class Rect {
  constructor(
    public left = 0,
    public top = 0,
    public width = 0,
    public height = 0,
  ) {}
}

function element(
  box: Rect,
  width = box.width,
  height = box.height,
): HTMLElement {
  return {
    offsetWidth: width,
    offsetHeight: height,
    getBoundingClientRect: () => box,
  } as HTMLElement;
}

afterEach(() => vi.unstubAllGlobals());

describe("getClientRect", () => {
  it("does not turn rounded offset dimensions into an artificial scale", () => {
    vi.stubGlobal("DOMRect", Rect);
    const root = element(new Rect(40, 100, 412, 877.75), 412, 878);
    const image = element(new Rect(40, 100, 412, 412));
    expect(getClientRect(root, image)).toEqual(new Rect(0, 0, 412, 412));
  });

  it("still normalizes live page scale while preserving a translated row position", () => {
    vi.stubGlobal("DOMRect", Rect);
    const root = element(new Rect(40, 100, 320, 640), 400, 800);
    const image = element(new Rect(24, 180, 80, 80), 100, 100);
    expect(getClientRect(root, image)).toEqual(new Rect(-20, 100, 100, 100));
  });
});
