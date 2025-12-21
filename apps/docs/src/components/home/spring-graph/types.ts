export interface SimulationFrame {
  time: number; // ms
  position: number; // 0 ~ 1
  velocity: number;
}

export interface SpringSettings {
  stiffness: number;
  damping: number;
}

export interface GraphConfig {
  leader: SpringSettings;
  follower: SpringSettings | null; // null = single spring mode
}

export const SLIDER_RANGES = {
  stiffness: { min: 50, max: 1000, step: 10, default: 300 },
  damping: { min: 5, max: 100, step: 1, default: 30 },
} as const;

export const DEFAULT_SPRING: SpringSettings = {
  stiffness: SLIDER_RANGES.stiffness.default,
  damping: SLIDER_RANGES.damping.default,
};
