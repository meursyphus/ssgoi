import { useEffect, useMemo, useRef } from "react";

type Frame = {
  timestamp: number;
  timeSincePreviousFrame: number;
  timeSinceFirstFrame: number;
};
const callbacks = new Set<{
  active: boolean;
  callback: (frame: Frame) => void;
}>();
let elapsed = 0;

/** Drive the real playback worklet in JS; this verifies lifecycle, not device rendering. */
export function useTestFrameCallback(
  callback: (frame: Frame) => void,
  autostart = true,
) {
  const entry = useRef({ active: autostart, callback });
  entry.current.callback = callback;
  useEffect(() => {
    callbacks.add(entry.current);
    const current = entry.current;
    return () => {
      callbacks.delete(current);
    };
  }, []);
  return useMemo(
    () => ({
      setActive: (active: boolean) => {
        entry.current.active = active;
      },
    }),
    [],
  );
}

export function useTestSharedValue<T>(value: T) {
  return useRef({ value }).current;
}

export function advanceFrames(duration: number, delta = 1000 / 60) {
  for (let t = 0; t < duration; t += delta) {
    elapsed += delta;
    for (const entry of [...callbacks])
      if (entry.active)
        entry.callback({
          timestamp: elapsed,
          timeSincePreviousFrame: delta,
          timeSinceFirstFrame: elapsed,
        });
  }
}
export function activeClocks() {
  return [...callbacks].filter((entry) => entry.active).length;
}
