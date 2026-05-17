import type { PhysicsOptions } from "@types";
import type {
  AxisAnimationConfig,
  AxisProvider,
  AxisProviderBuildArgs,
} from "../types";

// Inspired by Flutter's `SharedAxisTransition` (horizontal). Fade overlap is
// shaped via MultiAnimation's `startAt` (in the composition below) rather
// than fade-window mapping inside the style fns — opacity runs 0..1 over
// each side's own spring, and the cross-fade feel comes from the offset
// start alone.
//   - Curves.fastOutSlowIn (~ ease-in-out, approximated by doubleSpring 0.7)
//   - Very stiff (2400/65) lands the motion around ~160ms — page nav wants
//     a decisive, tactile feel rather than a settle.
//   - 8 px slide. Flutter's 30 is *dp* (logical pixels on a device with dpi
//     scaling) — our mobile showcase frame renders 1:1 so 30 reads as a far
//     bigger shift than Material intended. Korean messenger apps (KakaoTalk)
//     use an even more minimal slide.
const TRANSLATE_OFFSET = 8; // px
const X_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 1000, damping: 40, doubleSpring: 1.2 },
};

function buildX({ direction }: AxisProviderBuildArgs): AxisAnimationConfig {
  // forward: incoming arrives from the right.
  // backward: incoming arrives from the left.
  // Outgoing side stays in place and only fades — feels lighter than the
  // dual-slide Material default; closer to KakaoTalk's tab switch.
  const inStart =
    direction === "forward" ? TRANSLATE_OFFSET : -TRANSLATE_OFFSET;

  return {
    out: {
      willChange: "transform, opacity",
      startStyle: {},
      animate: (t) => ({
        opacity: `${1 - t}`,
      }),
    },
    in: {
      willChange: "transform, opacity",
      startStyle: {
        transform: `translate3d(${inStart}px, 0, 0)`,
        opacity: "0",
      },
      animate: (t) => ({
        transform: `translate3d(${inStart * (1 - t)}px, 0, 0)`,
        opacity: `${t}`,
      }),
    },
  };
}

export function createXProvider(): AxisProvider {
  return {
    physics: X_PHYSICS,
    // `startAt[1] = 0.3` shifts inAnim's start to outAnim's 30% progress
    // mark, giving a light cross-fade overlap. Lower it (→ 0) for fuller
    // cross-fade, raise it (→ 1) toward strict fade-through.
    composition: { mode: "parallel", startAt: [0, 0] },
    build: buildX,
  };
}
