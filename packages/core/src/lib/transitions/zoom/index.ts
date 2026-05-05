import type { SsgoiTransitionConfig } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { zoom as transition } from "./transition";
import type { ZoomType } from "./types";

export type ZoomConfig = {
  paths: readonly string[];
  type: ZoomType;
};

export function zoom({ paths, type }: ZoomConfig): SsgoiTransitionConfig[] {
  return createSymmetricPathTransitions(paths, () => transition({ type }));
}
