import { describe, expect, it } from "vitest";
import { createNonDirectionalYProvider } from "./non-directional";

describe("non-directional y axis provider", () => {
  it("cross-fades both sides while the incoming page rises 20px", () => {
    const provider = createNonDirectionalYProvider();
    const forward = provider.build({ direction: "forward" });
    const backward = provider.build({ direction: "backward" });

    expect(provider.composition).toEqual({
      mode: "parallel",
      startAt: [0, 0],
    });
    expect(forward.in.startStyle).toEqual({
      transform: "translate3d(0, 20px, 0)",
      opacity: "0",
    });
    expect(forward.in.animate(0.5)).toEqual({
      transform: "translate3d(0, 10px, 0)",
      opacity: "0.5",
    });
    expect(forward.out.animate(0.5)).toEqual({ opacity: "0.5" });
    expect(backward.in.startStyle).toEqual(forward.in.startStyle);
  });

  it("uses a double spring only for the slower incoming page", () => {
    const provider = createNonDirectionalYProvider();

    expect(provider.outPhysics).toEqual({
      inertia: { acceleration: 150, resistance: 1.5, restDelta: 0.1 },
    });
    expect(provider.inPhysics.spring?.doubleSpring).toBe(1.2);
  });
});
