import { describe, expect, it } from "vitest";
import { createBlurProvider } from "./blur";

describe("sheet blur provider", () => {
  const { background } = createBlurProvider();

  it("declares the filter channels it animates", () => {
    expect(background.willChange).toContain("filter");
    expect(background.willChange).toContain("transform");
    expect(background.willChange).toContain("opacity");
  });

  it("enter ramps from rest to frosted-and-receded", () => {
    const rest = background.enterStyle(0, 1);
    expect(rest).toEqual({
      transform: "scale(1)",
      filter: "blur(0.00px)",
      opacity: 1,
    });

    const peak = background.enterStyle(1, 0);
    expect(peak.transform).toBe("scale(0.92)");
    expect(peak.filter).toBe("blur(16.00px)");
    expect(peak.opacity).toBeCloseTo(0.6);
  });

  it("exit is the inverse ramp — frosted back to rest", () => {
    const start = background.exitStyle(0);
    expect(start.transform).toBe("scale(0.92)");
    expect(start.filter).toBe("blur(16.00px)");
    expect(start.opacity).toBeCloseTo(0.6);

    const rest = background.exitStyle(1);
    expect(rest).toEqual({
      transform: "scale(1)",
      filter: "blur(0.00px)",
      opacity: 1,
    });
  });

  it("clamps the blur radius to >= 0 when the spring overshoots", () => {
    // enter overshoot below 0 and exit overshoot past 1 both push the raw
    // radius negative — it must clamp, never emit `blur(-Npx)` (invalid CSS).
    expect(background.enterStyle(-0.1, 1.1).filter).toBe("blur(0.00px)");
    expect(background.exitStyle(1.1).filter).toBe("blur(0.00px)");
  });
});
