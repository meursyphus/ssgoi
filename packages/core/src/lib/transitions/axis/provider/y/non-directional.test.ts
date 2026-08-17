import { describe, expect, it } from "vitest";
import { IntegratorProvider } from "../../../../animation";
import { createNonDirectionalYProvider } from "./non-directional";

function settleDurationMs(
  physics: Parameters<typeof IntegratorProvider.from>[0],
): number {
  const integrator = IntegratorProvider.from(physics);
  const dt = 1 / 60;
  let state = { position: 0, velocity: 0 };

  for (let frame = 1; frame <= 120; frame += 1) {
    state = integrator.step(state, 1, dt);
    if (integrator.isSettled(state, 1)) return frame * dt * 1000;
  }

  throw new Error("axis y integrator did not settle within two seconds");
}

describe("non-directional y axis provider", () => {
  it("cross-fades both sides while the incoming page rises 40px", () => {
    const provider = createNonDirectionalYProvider();
    const forward = provider.build({ direction: "forward" });
    const backward = provider.build({ direction: "backward" });

    expect(provider.composition).toEqual({
      mode: "parallel",
      startAt: [0, 0],
    });
    expect(forward.in.startStyle).toEqual({
      transform: "translate3d(0, 40px, 0)",
      opacity: "0",
    });
    expect(forward.in.animate(0.5)).toEqual({
      transform: "translate3d(0, 20px, 0)",
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

  it("settles the incoming page in about twice the outgoing time", () => {
    const provider = createNonDirectionalYProvider();
    const outMs = settleDurationMs(provider.outPhysics);
    const inMs = settleDurationMs(provider.inPhysics);

    expect(outMs).toBeGreaterThanOrEqual(100);
    expect(outMs).toBeLessThanOrEqual(150);
    expect(inMs).toBeGreaterThanOrEqual(225);
    expect(inMs).toBeLessThanOrEqual(300);
    expect(inMs / outMs).toBeGreaterThanOrEqual(1.8);
    expect(inMs / outMs).toBeLessThanOrEqual(2.2);
  });
});
