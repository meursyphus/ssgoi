import { afterEach, describe, expect, it, vi } from "vitest";
import { clampOpacity, retainOpacity } from "./crossfade";

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
