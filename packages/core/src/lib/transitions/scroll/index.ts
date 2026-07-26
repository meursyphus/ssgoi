import type { AnyTransitionConfig } from "@types";
import { scroll as transition } from "./transition";

export type ScrollConfig = {
  /**
   * - `"directional"` (default): the surrounding rule decides direction.
   *   An ordered rule maps earlier → later to forward.
   * - `"non-directional"`: every transition scrolls upward (pages slide up, new
   *   page enters from the bottom). Direction is fixed — not user-configurable.
   */
  type?: "directional" | "non-directional";
  variant?: "default";
  options?: object;
};

export function scroll(config: ScrollConfig = {}): AnyTransitionConfig {
  const { type = "directional" } = config;
  return transition({ directional: type === "directional" });
}
