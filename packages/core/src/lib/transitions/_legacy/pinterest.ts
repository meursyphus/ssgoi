import type { SggoiTransition } from "@types";
import { zoom } from "../zoom/transition";

interface PinterestOptions {
  timeout?: number;
}

export const pinterest = (options: PinterestOptions = {}): SggoiTransition =>
  zoom({
    ...options,
    type: "legacy-pinterest",
  });
