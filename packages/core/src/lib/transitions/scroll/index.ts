import type { SsgoiPathTransition } from "@types";
import {
  createOrderedPathTransitions,
  createSymmetricPathTransitions,
} from "../utils";
import { scroll as transition } from "./transition";

export type ScrollConfig = {
  paths: readonly string[];
  /**
   * - `"directional"` (기본): paths 순서에 따라 정/역방향이 결정된다. 앞→뒤는 위로,
   *   뒤→앞은 아래로 움직인다.
   * - `"non-directional"`: paths 순서와 무관하게 항상 같은 방향으로 움직인다.
   *   `direction` 옵션으로 방향을 지정한다 (기본 "up").
   */
  type?: "directional" | "non-directional";
  /** `type: "non-directional"`일 때만 의미가 있다. 기본값은 "up" (아래에서 위로). */
  direction?: "up" | "down";
};

export function scroll({
  paths,
  type = "directional",
  direction = "up",
}: ScrollConfig): SsgoiPathTransition[] {
  if (type === "non-directional") {
    return createSymmetricPathTransitions(paths, () =>
      transition({ direction }),
    );
  }
  return createOrderedPathTransitions(
    paths,
    { forward: "up", backward: "down" },
    (dir) => transition({ direction: dir }),
  );
}
