import { describe, expect, it } from "vitest";
import { createMediaGeometry } from "../media-geometry";
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

    // Pre-transform elliptical radii become a circular 16px radius after the
    // independent 0.5 × 0.25 page scale.
    expect(animation.animate(0).clipPath).toContain("round 32px / 64px");
    // At progress=1: visibleR = 0 → no rounding.
    expect(animation.animate(1).clipPath).toContain("round 0px / 0px");
  });

  it("rounds the tile clip-path so visible radius matches exitRadius on zoom-out end", () => {
    const animation = createZoomOut(input({ exitRadius: 16 }));

    // animate(0) corresponds to the tile state (t=1): scale (0.5, 0.25).
    expect(animation.animate(0).clipPath).toContain("round 32px / 64px");
    // animate(1) is the full-page state (t=0): no rounding.
    expect(animation.animate(1).clipPath).toContain("round 0px / 0px");
  });

  it("maps contain content into a cropped cover window without distortion", () => {
    const enterRect = rect(0, 100, 400, 400);
    const exitRect = rect(20, 30, 100, 100);
    const mediaInput = input({
      enterRect,
      exitRect,
      pageRect: rect(0, 0, 400, 800),
      enterMedia: createMediaGeometry(enterRect, 2, "contain"),
      exitMedia: createMediaGeometry(exitRect, 2, "cover"),
    });

    const zoomInStart = createZoomIn(mediaInput).animate(0);
    const zoomOutEnd = createZoomOut(mediaInput).animate(0);

    expect(zoomInStart.transform).toBe(
      "translate(-130px, -220px) scale(0.5, 0.5)",
    );
    expect(zoomInStart.clipPath).toBe("inset(25% 25% 50% 25% round 0px / 0px)");
    expect(zoomOutEnd).toEqual(zoomInStart);
  });

  it("falls back to bbox math when the detail image cannot render the projected crop", () => {
    const enterRect = rect(0, 100, 400, 400);
    const exitRect = rect(20, 30, 100, 100);
    const animation = createZoomIn(
      input({
        enterRect,
        exitRect,
        pageRect: rect(0, 0, 400, 800),
        enterMedia: createMediaGeometry(enterRect, 2, "cover"),
        exitMedia: createMediaGeometry(exitRect, 2, "contain"),
      }),
    );

    expect(animation.animate(0).transform).toBe(
      "translate(-130px, -220px) scale(0.25, 0.25)",
    );
  });

  it("falls back to bbox math when endpoint media ratios differ", () => {
    const enterRect = rect(0, 100, 400, 400);
    const exitRect = rect(20, 30, 100, 100);
    const animation = createZoomIn(
      input({
        enterRect,
        exitRect,
        pageRect: rect(0, 0, 400, 800),
        enterMedia: createMediaGeometry(enterRect, 2, "contain"),
        exitMedia: createMediaGeometry(exitRect, 1, "cover"),
      }),
    );

    expect(animation.animate(0).transform).toBe(
      "translate(-130px, -220px) scale(0.25, 0.25)",
    );
  });
});
