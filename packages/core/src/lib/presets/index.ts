import type { SpringConfig } from "../types";

export const defaultSpring: SpringConfig = {
  stiffness: 170,
  damping: 26,
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
  stiffness: 280,
  damping: 120,
};

export const config = {
  default: defaultSpring,
  gentle,
  wobbly,
  stiff,
  slow,
  molasses,
} as const;