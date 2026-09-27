import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clampOpacity,
  crossfadeUnderOpacity,
  retainOpacity,
} from "./crossfade";

function image(opacity = "", priority = "") {
  const style = {
    opacity,
    priority,
    getPropertyValue: () => style.opacity,
    getPropertyPriority: () => style.priority,
    setProperty: (_name: string, value: string, importance: string) => {
      style.opacity = value;
      style.priority = importance;
    },
    removeProperty: () => {
      style.opacity = "";
      style.priority = "";
    },
  };
  vi.stubGlobal("getComputedStyle", () => ({ opacity: opacity || "0.6" }));
  return { style } as unknown as HTMLElement;
}

afterEach(() => vi.unstubAllGlobals());

describe("in-page shared visual compositing", () => {
  it.each([1, 0.6, 0])(
    "preserves weighted color and alpha with overlay opacity %s",
    (overlayOpacity) => {
      const opacity = 0.8;
      for (const progress of [-0.2, 0, 0.001, 0.25, 0.5, 0.75, 1, 1.2]) {
        const t = clampOpacity(progress);
        const upperAlpha = (1 - t) * overlayOpacity;
        const lowerAlpha = crossfadeUnderOpacity(
          progress,
          opacity,
          overlayOpacity,
        );
        expect(lowerAlpha).toBeGreaterThanOrEqual(0);
        expect(lowerAlpha).toBeLessThanOrEqual(opacity);
        // Source-over: the upper image masks a portion of the lower image.
        expect(lowerAlpha * (1 - upperAlpha)).toBeCloseTo(t * opacity);
        expect(upperAlpha + lowerAlpha * (1 - upperAlpha)).toBeCloseTo(
          (1 - t) * overlayOpacity + t * opacity,
        );
      }
    },
  );

  it("keeps opaque media opaque from the staged start through spring overshoot", () => {
    for (const progress of [-0.2, 0, 0.25, 0.5, 0.75, 1, 1.2])
      expect(crossfadeUnderOpacity(progress, 1, 1)).toBe(1);
  });
});

describe("shared visual opacity ownership", () => {
  it("restores stylesheet opacity without leaving an inline override", () => {
    const element = image();
    const owner = retainOpacity(element);
    expect(owner.opacity).toBe(0.6);
    owner.set(0);
    owner.restore();
    expect(element.style.opacity).toBe("");
  });

  it.each([true, false])(
    "keeps replacement ownership and restores original priority (old first: %s)",
    (oldFirst) => {
      const element = image("0.8", "important");
      const old = retainOpacity(element);
      old.set(0);
      const replacement = retainOpacity(element);
      expect(replacement.opacity).toBe(0.8);
      replacement.set(0);
      // Finishing either run can write its endpoint after the other is staged.
      element.style.opacity = "1";
      const first = oldFirst ? old : replacement;
      const last = oldFirst ? replacement : old;
      first.restore();
      expect(element.style.opacity).toBe("0");
      first.restore();
      expect(element.style.opacity).toBe("0");
      last.restore();
      expect(element.style.opacity).toBe("0.8");
      expect(element.style.getPropertyPriority("opacity")).toBe("important");
    },
  );

  it("clamps spring overshoot without affecting geometry progress", () => {
    expect([-0.2, 0, 0.5, 1, 1.2].map(clampOpacity)).toEqual([0, 0, 0.5, 1, 1]);
  });
});
