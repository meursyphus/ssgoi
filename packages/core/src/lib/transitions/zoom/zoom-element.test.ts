import { describe, expect, it } from "vitest";
import { createZoomIn, createZoomOut } from "./zoom-element";
import type { ZoomAnimationInput } from "./types";

function rect(left: number, top: number, width: number, height: number) {
  return { left, top, width, height } as DOMRect;
}

function input(
  overrides: Partial<ZoomAnimationInput> = {},
): ZoomAnimationInput {
  return {
    enterRect: rect(10, 20, 100, 200),
    exitRect: rect(20, 30, 50, 50),
    pageRect: rect(0, 0, 200, 400),
    scrollOffset: { x: 0, y: 0 },
    enterRadius: 0,
    exitRadius: 0,
    ...overrides,
  };
}

describe("zoom-element", () => {
  it("zooms in with independent x/y scale when rect aspect ratios differ", () => {
    const animation = createZoomIn(input());

    expect(animation.animate(0).transform).toBe(
      "translate(-15px, -65px) scale(0.5, 0.25)",
    );
    expect(animation.animate(1).transform).toBe(
      "translate(0px, 0px) scale(1, 1)",
    );
  });

  it("zooms out with independent x/y scale when rect aspect ratios differ", () => {
    const animation = createZoomOut(input());

    expect(animation.animate(1).transform).toBe(
      "translate(0px, 0px) scale(1, 1)",
    );
    expect(animation.animate(0).transform).toBe(
      "translate(-15px, -65px) scale(0.5, 0.25)",
    );
  });

  it("rounds the tile clip-path so visible radius matches exitRadius on zoom-in start", () => {
    const animation = createZoomIn(input({ exitRadius: 16 }));

    // At progress=0: page is scaled to (0.5, 0.25) → avg 0.375.
    // visibleR = 16 → cpR = 16 / 0.375 ≈ 42.667px.
    expect(animation.animate(0).clipPath).toContain(`round ${16 / 0.375}px`);
    // At progress=1: visibleR = 0 → no rounding.
    expect(animation.animate(1).clipPath).toContain("round 0px");
  });

  it("rounds the tile clip-path so visible radius matches exitRadius on zoom-out end", () => {
    const animation = createZoomOut(input({ exitRadius: 16 }));

    // animate(0) corresponds to the tile state (t=1): scale (0.5, 0.25),
    // visibleR = exitRadius = 16, cpR = 16 / 0.375.
    expect(animation.animate(0).clipPath).toContain(`round ${16 / 0.375}px`);
    // animate(1) is the full-page state (t=0): no rounding.
    expect(animation.animate(1).clipPath).toContain("round 0px");
  });
});
