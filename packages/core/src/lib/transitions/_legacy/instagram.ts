import type { SggoiTransition } from "@types";
import { zoom } from "../zoom/transition";

interface InstagramOptions {
  timeout?: number;
}

export const instagram = (options: InstagramOptions = {}): SggoiTransition =>
  zoom({
    ...options,
    type: "static",
  });
