import type { SsgoiPathTransition } from "@types";
import { createOrderedPathTransitions } from "../utils";
import { axis as transition } from "./transition";

// Note: the underlying transition/provider supports y/z too, but only x is
// exposed publicly right now — y/z haven't been UX-verified yet and we don't
// want to ship a type union that promises more than is polished.
//
// `feel` is an orthogonal dimension to `type` — within the x axis there are
// two flavors:
//   - 'snappy' (default): KakaoTalk-style tab swap. Tight, ~160 ms, 8 px
//     slide on incoming only, parallel cross-fade.
//   - 'fluid': Flutter SharedAxisTransition. Relaxed, ~300 ms, 30 px slide
//     on both sides, fade-through with asymmetric easings.
export type AxisConfig = {
  paths: readonly string[];
  type?: "x";
  feel?: "snappy" | "fluid";
};

export function axis({ paths, feel }: AxisConfig): SsgoiPathTransition[] {
  return createOrderedPathTransitions(
    paths,
    { forward: "forward", backward: "backward" },
    (direction) => transition({ type: "x", direction, feel }),
  );
}
