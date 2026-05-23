import type { SsgoiPathTransition } from "@types";
import {
  createOrderedPathTransitions,
  createSymmetricPathTransitions,
} from "../utils";
import { scroll as transition } from "./transition";

export type ScrollConfig = {
  paths: readonly string[];
  /**
   * - `"directional"` (default): path order decides direction. Earlier → later
   *   scrolls up; later → earlier scrolls down.
   * - `"non-directional"`: every transition scrolls upward (pages slide up, new
   *   page enters from the bottom). Direction is fixed — not user-configurable.
   */
  type?: "directional" | "non-directional";
  variant?: "default";
  options?: object;
};

export function scroll(config: ScrollConfig): SsgoiPathTransition[] {
  const { paths, type = "directional" } = config;

  if (type === "non-directional") {
    return createSymmetricPathTransitions(paths, () =>
      transition({ direction: "up" }),
    );
  }
  return createOrderedPathTransitions(
    paths,
    { forward: "up", backward: "down" },
    (dir) => transition({ direction: dir }),
  );
}
