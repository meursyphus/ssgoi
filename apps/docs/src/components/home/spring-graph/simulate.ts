import {
  SpringIntegrator,
  DoubleSpringIntegrator,
  type Integrator,
  type IntegratorState,
} from "@ssgoi/react/transitions";
import type { GraphConfig, SimulationFrame } from "./types";

const DT = 0.016; // 16ms per frame (60fps)
const MAX_TIME_MS = 2000; // max 2 seconds

export function createIntegrator(config: GraphConfig): Integrator {
  if (config.follower) {
    return new DoubleSpringIntegrator({
      stiffness: config.leader.stiffness,
      damping: config.leader.damping,
      follower: {
        stiffness: config.follower.stiffness,
        damping: config.follower.damping,
      },
    });
  }
  return new SpringIntegrator({
    stiffness: config.leader.stiffness,
    damping: config.leader.damping,
  });
}

export function simulate(config: GraphConfig): SimulationFrame[] {
  const integrator = createIntegrator(config);
  const frames: SimulationFrame[] = [];
  let state: IntegratorState = { position: 0, velocity: 0 };
  let time = 0;
  const target = 1;

  while (time < MAX_TIME_MS) {
    frames.push({
      time,
      position: state.position,
      velocity: state.velocity,
    });

    state = integrator.step(state, target, DT);

    if (integrator.isSettled(state, target)) {
      frames.push({
        time: time + DT * 1000,
        position: target,
        velocity: 0,
      });
      break;
    }

    time += DT * 1000;
  }

  return frames;
}
