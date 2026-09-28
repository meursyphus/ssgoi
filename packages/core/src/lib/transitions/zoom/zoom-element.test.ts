import { describe, expect, it } from "vitest";
import { createMediaGeometry } from "../media-geometry";
import { buildTileGeometry, createZoomIn, createZoomOut } from "./zoom-element";
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
    expect(animation.animate(0).clipPath).toContain("round 16% / 16%");
    // At progress=1: visibleR = 0 → no rounding.
    expect(animation.animate(1).clipPath).toContain("round 0% / 0%");
  });

  it("rounds the tile clip-path so visible radius matches exitRadius on zoom-out end", () => {
    const animation = createZoomOut(input({ exitRadius: 16 }));

    // animate(0) corresponds to the tile state (t=1): scale (0.5, 0.25).
    expect(animation.animate(0).clipPath).toContain("round 16% / 16%");
    // animate(1) is the full-page state (t=0): no rounding.
    expect(animation.animate(1).clipPath).toContain("round 0% / 0%");
  });

  it.each([createZoomIn, createZoomOut])(
    "keeps percentage radii circular through playback on a tall page",
    (createAnimation) => {
      const animation = createAnimation(
        input({
          pageRect: rect(0, 0, 400, 900),
          enterRect: rect(0, 0, 400, 400),
          exitRect: rect(20, 30, 144, 144),
          exitRadius: 16,
        }),
      );
      for (const progress of [0, 0.02, 0.25, 0.5, 1]) {
        const clip = animation.animate(progress).clipPath;
        const radii = /round ([\d.e-]+)% \/ ([\d.e-]+)%/.exec(clip!);
        expect(radii).not.toBeNull();
        const scale = 0.36 + 0.64 * progress;
        // The window (and its corner) closes ahead of the shrinking tile.
        const closing =
          createAnimation === createZoomOut
            ? Math.min(1, (1 - progress) / 0.85)
            : 1 - progress;
        // Percent radii resolve against the whole 400x900 element, not the
        // inset photo window. Both axes must paint the same radius after scale.
        expect((Number(radii![1]) / 100) * 400 * scale).toBeCloseTo(
          16 * closing,
        );
        expect((Number(radii![2]) / 100) * 900 * scale).toBeCloseTo(
          16 * closing,
        );
      }
    },
  );

  it("closes the zoom-out window onto the visual before the tile settles", () => {
    const animation = createZoomOut(
      input({
        pageRect: rect(0, 0, 400, 900),
        enterRect: rect(0, 0, 400, 400),
        exitRect: rect(20, 30, 144, 144),
        exitRadius: 16,
      }),
    );
    const insets = (progress: number) =>
      animation.animate(progress).clipPath!.split(" round ")[0];
    // Same window as the landed tile, while the transform still moves
    // (the corner percentages differ because they track the live scale).
    expect(insets(0.1)).toBe(insets(0));
    expect(animation.animate(0.1).transform).not.toBe(
      animation.animate(0).transform,
    );
    // Half way the window is still opening toward the full page.
    expect(insets(0.5)).not.toBe(insets(0));
    expect(insets(1)).toBe("inset(0% 0% 0% 0%");
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
    expect(zoomInStart.clipPath).toBe("inset(25% 25% 50% 25% round 0% / 0%)");
    expect(zoomOutEnd).toEqual(zoomInStart);
  });

  it("keeps a uniform scale over the shared part when the detail image cannot render the projected crop", () => {
    const enterRect = rect(0, 100, 400, 400);
    const exitRect = rect(20, 30, 100, 100);
    const mediaInput = input({
      enterRect,
      exitRect,
      pageRect: rect(0, 0, 400, 800),
      // The detail crops the sides of a 2:1 picture the card shows whole.
      enterMedia: createMediaGeometry(enterRect, 2, "cover"),
      exitMedia: createMediaGeometry(exitRect, 2, "contain"),
      exitRadius: 16,
    });
    const geometry = buildTileGeometry(mediaInput);
    expect(geometry.partial).toBe(true);
    // The tile can show the detail's own window only; the card's rounded
    // corners lie outside it, so the strip stays square.
    expect(geometry.startWindow).toEqual(rect(0, 100, 400, 400));
    expect(geometry.exitCornerRadii).toEqual([0, 0, 0, 0]);

    const start = createZoomIn(mediaInput).animate(0);
    // One factor on both axes (100 / 800 of the picture), not the 0.25 ×
    // 0.25 bbox stretch of the whole page into the card's box.
    expect(start.transform).toBe(
      "translate(-130px, -220px) scale(0.125, 0.125)",
    );
    expect(start.clipPath).toContain("inset(12.5% 0% 37.5% 0%");
    expect(createZoomOut(mediaInput).animate(0)).toEqual(start);
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
