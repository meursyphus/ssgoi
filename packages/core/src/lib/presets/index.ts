import type { SpringConfig } from "../types";

// Default = critically-damped ease-out feel (~310ms). Aligns with mobile nav
// baseline used by drill (Material decelerated curve, Apple HIG push).
export const defaultSpring: SpringConfig = {
  stiffness: 170,
  damping: 26,
};

// Easing-named presets grounded in Material Motion / Apple HIG:
// - easeOut: incoming elements (sheet open, page push) — slight underdamp, ~310ms
// - easeInOut: in-place transformations (Z-axis depth, tab swap) — near-critical, ~280ms
// - snappy: small decisive motion (snap) — quick punch, ~250ms
// True ease-in is not producible by a spring; use the inertia integrator.
export const easeOut: SpringConfig = {
  stiffness: 170,
  damping: 22,
};

export const easeInOut: SpringConfig = {
  stiffness: 280,
  damping: 30,
};

export const snappy: SpringConfig = {
  stiffness: 400,
  damping: 30,
};

export const gentle: SpringConfig = {
  stiffness: 120,
  damping: 14,
};

export const wobbly: SpringConfig = {
  stiffness: 180,
  damping: 12,
};

export const stiff: SpringConfig = {
  stiffness: 210,
  damping: 20,
};

export const slow: SpringConfig = {
  stiffness: 280,
  damping: 60,
};

export const molasses: SpringConfig = {
  stiffness: 150,
  damping: 60,
};

export const config = {
  default: defaultSpring,
  easeOut,
  easeInOut,
  snappy,
  gentle,
  wobbly,
  stiff,
  slow,
  molasses,
} as const;
