import type { PhysicsOptions } from "@types";
import type {
  AxisAnimationConfig,
  AxisProvider,
  AxisProviderBuildArgs,
} from "../../types";

// "Snappy" x — modeled after **KakaoTalk**'s tab/page swap on iOS/Android.
// Outgoing stays in place and only fades; incoming slides in a very short
// distance while fading up. The whole motion lands fast and decisively, giving
// the messenger-app "tactile tap" feel rather than a Material settle.
//
// Differences from Flutter's SharedAxisTransition (which the `fluid` x sibling
// implements):
//   - No out-slide. Outgoing only fades.
//   - 8 px slide vs. Flutter's 30. Flutter's 30 is in dp on a dpi-scaled
//     device; our mobile showcase renders 1:1 so 30 reads as a much bigger
//     shift than Material intended. Korean messenger apps also use a more
//     minimal slide than Material defaults.
//   - Parallel cross-fade (both sides fade simultaneously), not fade-through.
//   - Very stiff spring — lands around ~160 ms.
const KAKAO_SLIDE_PX = 8;

// Loosen the settle thresholds 10× over the integrator defaults
// (0.01 → 0.1 for both position and velocity). With a very stiff spring the
// tail past ~98% is visually indistinguishable but still simulates for a few
// extra frames; bumping the thresholds lets the snappy x land sooner without
// changing the perceived motion.
const SNAPPY_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 1000,
    damping: 40,
    doubleSpring: 1.2,
    restDelta: 0.1,
    restSpeed: 0.1,
  },
};

function buildSnappyX({
  direction,
}: AxisProviderBuildArgs): AxisAnimationConfig {
  // forward: incoming arrives from the right.
  // backward: incoming arrives from the left.
  const inStart = direction === "forward" ? KAKAO_SLIDE_PX : -KAKAO_SLIDE_PX;

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

export function createSnappyXProvider(): AxisProvider {
  return {
    outPhysics: SNAPPY_PHYSICS,
    inPhysics: SNAPPY_PHYSICS,
    // Both sides run together — the cross-fade is the whole point of the
    // snappy feel. (fluid's sibling uses staggered fade-through.)
    composition: { mode: "parallel", startAt: [0, 0] },
    build: buildSnappyX,
  };
}
