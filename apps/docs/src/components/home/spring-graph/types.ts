export interface SimulationFrame {
  time: number; // ms
  position: number; // 0 ~ 1
  velocity: number;
}

export interface SpringSettings {
  stiffness: number;
  damping: number;
}

export type ResistanceType = "linear" | "quadratic";

export interface InertiaSettings {
  acceleration: number;
  resistance: number;
  resistanceType: ResistanceType;
}

export interface GraphConfig {
  leader: SpringSettings;
  follower: SpringSettings | null; // null = single spring mode
  inertia: InertiaSettings | null; // null = spring mode, non-null = inertia mode
}

export const SLIDER_RANGES = {
  stiffness: { min: 50, max: 1000, step: 10, default: 300 },
  damping: { min: 5, max: 100, step: 1, default: 30 },
  acceleration: { min: 1, max: 50, step: 1, default: 10 },
  resistance: { min: 0.1, max: 10, step: 0.1, default: 1 },
} as const;

export const DEFAULT_SPRING: SpringSettings = {
  stiffness: SLIDER_RANGES.stiffness.default,
  damping: SLIDER_RANGES.damping.default,
};

export const DEFAULT_INERTIA: InertiaSettings = {
  acceleration: SLIDER_RANGES.acceleration.default,
  resistance: SLIDER_RANGES.resistance.default,
  resistanceType: "quadratic",
};
