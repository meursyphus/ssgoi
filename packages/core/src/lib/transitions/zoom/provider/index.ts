import { createExpandProvider } from "./expand";
import { createStaticProvider } from "./static";
import type { ZoomProvider, ZoomType } from "../types";

export const ZOOM_PROVIDERS: Record<ZoomType, ZoomProvider> = {
  expand: createExpandProvider(),
  static: createStaticProvider(),
};
