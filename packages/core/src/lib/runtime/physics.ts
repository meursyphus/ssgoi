import type { Integrator } from "../animation/integrator/types";

export type DoubleSpringFollowerConfig = {
  stiffness: number;
  damping: number;
};

export type SpringConfig = {
  stiffness: number;
  damping: number;
  doubleSpring?: boolean | number | DoubleSpringFollowerConfig;
  restDelta?: number;
  restSpeed?: number;
};

export type ResistanceType = "linear" | "quadratic";

export type InertiaConfig = {
  acceleration: number;
  resistance: number;
  resistanceType?: ResistanceType;
  min?: number;
  max?: number;
  bounceStiffness?: number;
  bounceDamping?: number;
  restDelta?: number;
};

export type IntegratorFactory = () => Integrator;

export type PhysicsOptions = {
  spring?: SpringConfig;
  inertia?: InertiaConfig;
  integrator?: IntegratorFactory;
};
