import { describe, expect, it } from "vitest";
import { createBlurProvider } from "./blur";

describe("sheet blur provider", () => {
  const { background, overlay } = createBlurProvider();

  it("keeps the blur off the background — it only recedes (scale + dim)", () => {
    expect(background.willChange).toBe("transform, opacity");
    expect(background.willChange).not.toContain("filter");
  });

  it("background enter ramps from rest to receded", () => {
    expect(background.enterStyle(0, 1)).toEqual({
      transform: "scale(1)",
      opacity: 1,
    });

    const peak = background.enterStyle(1, 0);
    expect(peak.transform).toBe("scale(0.92)");
    expect(peak.opacity).toBeCloseTo(0.6);
  });

  it("background exit is the inverse ramp — receded back to rest", () => {
    const start = background.exitStyle(0);
    expect(start.transform).toBe("scale(0.92)");
    expect(start.opacity).toBeCloseTo(0.6);

    expect(background.exitStyle(1)).toEqual({
      transform: "scale(1)",
      opacity: 1,
    });
  });

  it("exposes a backdrop-filter overlay layer that owns the blur", () => {
    expect(overlay).toBeDefined();
    expect(overlay?.willChange).toContain("backdrop-filter");
    // The overlay starts fully transparent so applying it before the first
    // tick has no visible cost.
    expect(overlay?.initialStyle.backdropFilter).toBe("blur(0px)");
    expect(overlay?.initialStyle.pointerEvents).toBe("none");
  });

  it("overlay frosts in on enter and out on exit", () => {
    const frost = (s: { backdropFilter?: string | number }) => s.backdropFilter;

    // enter: progress 0 → 1 ramps blur 0 → MAX.
    expect(frost(overlay!.style("enter", 0))).toBe("blur(0.00px)");
    expect(frost(overlay!.style("enter", 1))).toBe("blur(16.00px)");

    // exit: progress 0 → 1 ramps blur MAX → 0 (visual is inverted).
    expect(frost(overlay!.style("exit", 0))).toBe("blur(16.00px)");
    expect(frost(overlay!.style("exit", 1))).toBe("blur(0.00px)");

    // both vendor keys move together.
    const peak = overlay!.style("enter", 1);
    expect(peak.WebkitBackdropFilter).toBe(peak.backdropFilter);
  });

  it("clamps the overlay blur radius to >= 0 when progress overshoots", () => {
    // reversed enter (progress < 0) and exit overshoot (progress > 1) both
    // push the raw radius negative — it must clamp, never emit blur(-Npx).
    expect(overlay!.style("enter", -0.1).backdropFilter).toBe("blur(0.00px)");
    expect(overlay!.style("exit", 1.1).backdropFilter).toBe("blur(0.00px)");
  });
});
