import { useLayoutEffect } from "react";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { PageMotionPlan } from "@ssgoi/core/runtime";

export type PlaybackState = {
  id: number;
  elapsed: number;
  running: boolean;
  plan: PageMotionPlan | null;
};

/** One UI clock owns both tracks, including fade's sequence. No per-frame RN callbacks. */
export function useNativePlayback(
  id: number,
  plan: PageMotionPlan | null,
  ready: boolean,
  onComplete: (id: number) => void,
) {
  const playback = useSharedValue<PlaybackState>({
    id,
    plan: null,
    elapsed: 0,
    running: false,
  });
  useLayoutEffect(() => {
    playback.value = { id, plan, elapsed: 0, running: ready && plan !== null };
    return () => {
      playback.value = { id, plan: null, elapsed: 0, running: false };
    };
  }, [id, plan, ready, playback]);
  const clock = useFrameCallback((frame) => {
    const current = playback.value;
    if (!current.running || !current.plan) return;
    const elapsed = Math.min(
      current.plan.duration,
      current.elapsed + Math.min(frame.timeSincePreviousFrame ?? 0, 1000 / 30),
    );
    const finished = elapsed >= current.plan.duration;
    playback.value = { ...current, elapsed, running: !finished };
    if (finished) scheduleOnRN(onComplete, current.id);
  }, false);
  useLayoutEffect(() => {
    clock.setActive(ready && plan !== null);
    return () => clock.setActive(false);
  }, [clock, ready, plan]);
  return playback;
}
