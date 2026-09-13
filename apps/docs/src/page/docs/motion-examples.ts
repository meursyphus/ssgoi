export const OVERRIDE_EXAMPLE = `import { axis, spring, InertiaIntegrator } from "@ssgoi/core";

export const tunedAxis = axis(
  { type: "x", variant: "default" },
  {
    override: {
      forward({ animation }) {
        const outgoing = animation.select("out");
        const incoming = animation.select("in");

        outgoing.set({
          integrator: new InertiaIntegrator({ acceleration: 150, resistance: 1.5 }),
        });
        incoming.set({
          integrator: spring({ stiffness: 320, damping: 30 }),
          startAt: { after: outgoing, at: 0.3 },
        });
      },
      backward({ animation }) {
        animation.set({ integrator: spring({ stiffness: 400, damping: 35 }) });
      },
    },
  },
);`;

export const CUSTOM_TRANSITION_EXAMPLE = `import { defineTransition, MultiAnimation, WebAnimation, spring } from "@ssgoi/core";

const arriving = spring({ stiffness: 300, damping: 30 });
const leaving = spring({ stiffness: 400, damping: 35 });

export const customFade = defineTransition({
  forward: {
    async prepare({ from, to }) {
      const [outgoing, incoming] = await Promise.all([from, to]);
      const saved = {
        fromOpacity: outgoing.style.opacity,
        toOpacity: incoming.style.opacity,
      };
      incoming.style.opacity = "0";
      return { saved };
    },
    animation({ from, to, saved }) {
      const outgoing = new WebAnimation({
        element: from,
        integrator: leaving,
        style: (_t, u) => ({ opacity: u }),
        onComplete() {
          from.style.opacity = saved.fromOpacity;
          outgoing.releaseFill();
        },
      });
      const incoming = new WebAnimation({
        element: to,
        integrator: arriving,
        style: (t) => ({ opacity: t }),
        onComplete() {
          to.style.opacity = saved.toOpacity;
          incoming.releaseFill();
        },
      });
      incoming.set({ startAt: { after: outgoing, at: 0.3 } });
      return new MultiAnimation({ out: outgoing, in: incoming });
    },
  },
  backward: {
    async prepare({ from }) {
      return { savedOpacity: (await from).style.opacity };
    },
    animation({ from, savedOpacity }) {
      const outgoing = new WebAnimation({
        element: from,
        integrator: leaving,
        style: (_t, u) => ({ opacity: u }),
        onComplete() {
          from.style.opacity = savedOpacity;
          outgoing.releaseFill();
        },
      });
      return outgoing;
    },
  },
});

// Register it exactly like a built-in preset.
export const config = {
  transitions: [{ from: "/gallery", to: "/photo/*", transition: customFade }],
};`;

export const CUSTOM_OVERRIDE_EXAMPLE = `import { withOverride, spring } from "@ssgoi/core";
import { customFade } from "./custom-transition";

export const fasterFade = withOverride(customFade, {
  forward({ animation }) {
    // Inferred: MultiAnimation<"out" | "in">
    animation.select("in").set({ integrator: spring({ stiffness: 420, damping: 36 }) });
  },
  backward({ animation }) {
    // Inferred: WebAnimation
    animation.set({ integrator: spring({ stiffness: 480, damping: 40 }) });
  },
});`;

export const CUSTOM_INTEGRATOR_EXAMPLE = `import { WebAnimation, type Integrator, type IntegratorState } from "@ssgoi/core";

// Exact critically damped spring step with unit mass.
export class CriticalSpring implements Integrator {
  private readonly omega: number;

  constructor(stiffness: number) {
    if (!Number.isFinite(stiffness) || stiffness <= 0) {
      throw new Error("stiffness must be finite and positive");
    }
    this.omega = Math.sqrt(stiffness);
  }

  step(state: IntegratorState, target: number, dt: number): IntegratorState {
    const displacement = state.position - target;
    const c = state.velocity + this.omega * displacement;
    const decay = Math.exp(-this.omega * dt);
    return {
      position: target + (displacement + c * dt) * decay,
      velocity: (state.velocity - this.omega * c * dt) * decay,
    };
  }

  isSettled(state: IntegratorState, target: number): boolean {
    return Math.abs(target - state.position) < 0.01 && Math.abs(state.velocity) < 0.01;
  }
}

export function animateElement(element: HTMLElement) {
  return new WebAnimation({
    element,
    integrator: new CriticalSpring(300),
    style: (t) => ({ opacity: t }),
  });
}`;
