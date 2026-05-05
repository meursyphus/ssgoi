import type { PhysicsOptions } from "@types";
import {
  createEnterIn,
  createEnterOut,
  createExitIn,
  createExitOut,
} from "./animations";
import type { ZoomProvider, ZoomProviderType } from "./types";

const DEFAULT_EXPAND_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 340, damping: 30, doubleSpring: 1 },
};

const DEFAULT_STATIC_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 420, damping: 34 },
};

const ZOOM_ENTER_ATTRIBUTE = "data-zoom-enter-key";
const ZOOM_EXIT_ATTRIBUTE = "data-zoom-exit-key";
const PINTEREST_ENTER_ATTRIBUTE = "data-pinterest-detail-key";
const PINTEREST_EXIT_ATTRIBUTE = "data-pinterest-gallery-key";
const INSTAGRAM_ENTER_ATTRIBUTE = "data-instagram-detail-key";
const INSTAGRAM_EXIT_ATTRIBUTE = "data-instagram-gallery-key";

export const ZOOM_PROVIDERS: Record<ZoomProviderType, ZoomProvider> = {
  expand: {
    physics: DEFAULT_EXPAND_PHYSICS,
    enterAttribute: ZOOM_ENTER_ATTRIBUTE,
    exitAttribute: ZOOM_EXIT_ATTRIBUTE,
    in: createEnterIn,
    out: createExitOut,
    backgroundIn: createExitIn,
    backgroundOut: createEnterOut,
  },
  static: {
    physics: DEFAULT_STATIC_PHYSICS,
    enterAttribute: ZOOM_ENTER_ATTRIBUTE,
    exitAttribute: ZOOM_EXIT_ATTRIBUTE,
    in: createEnterIn,
    out: createExitOut,
  },
  "legacy-pinterest": {
    physics: DEFAULT_EXPAND_PHYSICS,
    enterAttribute: PINTEREST_ENTER_ATTRIBUTE,
    exitAttribute: PINTEREST_EXIT_ATTRIBUTE,
    in: createEnterIn,
    out: createExitOut,
    backgroundIn: createExitIn,
    backgroundOut: createEnterOut,
  },
  "legacy-instagram": {
    physics: DEFAULT_STATIC_PHYSICS,
    enterAttribute: INSTAGRAM_ENTER_ATTRIBUTE,
    exitAttribute: INSTAGRAM_EXIT_ATTRIBUTE,
    in: createEnterIn,
    out: createExitOut,
  },
};
