"use client";

import { useCallback, useState } from "react";

const memory = new Map<string, unknown>();

/**
 * useState that survives a remount within the session. Chips, tabs and the
 * search query come back as they were when the user returns with Back, so the
 * zoom exit key of the tapped thumbnail is on the first render again.
 */
export function useRememberedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() =>
    memory.has(key) ? (memory.get(key) as T) : initial,
  );
  const update = useCallback(
    (next: T) => {
      memory.set(key, next);
      setValue(next);
    },
    [key],
  );
  return [value, update] as const;
}

/**
 * Drops a remembered value so the next mount starts from `initial`. The
 * current render keeps its state, so a page that is leaving doesn't change
 * while it animates out.
 */
export function forgetRememberedState(key: string) {
  memory.delete(key);
}
