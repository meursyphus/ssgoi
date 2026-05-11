import type { PhysicsOptions } from "@types";
import type { ZoomAnimationConfig, ZoomProvider } from "../types";
import { createZoomIn, createZoomOut } from "../zoom-element";

export const STATIC_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 420, damping: 34 },
};

function noopAnimation(): ZoomAnimationConfig {
  return {
    transformOrigin: "",
    animate: () => ({}),
  };
}

export function createStaticProvider(): ZoomProvider {
  return {
    physics: STATIC_PHYSICS,
    in: createZoomIn,
    out: createZoomOut,
    backgroundIn: () => noopAnimation(),
    backgroundOut: () => noopAnimation(),
  };
}
