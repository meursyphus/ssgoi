import type { SsgoiPathTransition } from "@types";
import { createSymmetricPathTransitions } from "../utils";
import { zoom as transition } from "./transition";
import type { ZoomType } from "./types";

export type ZoomConfig = {
  paths: readonly string[];
  type: ZoomType;
  fade?: boolean;
};

export function zoom({ paths, type, fade }: ZoomConfig): SsgoiPathTransition[] {
  return createSymmetricPathTransitions(paths, () =>
    transition({ type, fade }),
  );
}
