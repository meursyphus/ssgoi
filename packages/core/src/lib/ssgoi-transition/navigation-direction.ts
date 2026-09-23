import type { NavigationDirection } from "@types";
import {
  connectBrowserHistory,
  type BrowserHistory,
  type HistoryEntry,
} from "./browser-history";
import { normalizePath } from "./path-pattern";

export type NavigationChange = {
  kind: "push" | "replace" | "back" | "forward" | "unknown";
  direction: NavigationDirection;
  from: HistoryEntry | null;
  to: HistoryEntry | null;
};

/** Created during render, connected only when a boundary is actually observed. */
export function createNavigationDirectionTracker() {
  let history: BrowserHistory | null = null;
  let current: HistoryEntry | null = null;
  const visited = new Set<string>();
  const remember = (entry: HistoryEntry | null) => {
    if (entry) visited.add(entry.key);
    if (visited.size > 200) visited.delete(visited.values().next().value!);
  };
  const connect = () => {
    if (history) return;
    history = connectBrowserHistory();
    current = history.read();
    remember(current);
  };

  return {
    connect,
    resolve(rawFrom: string, _rawTo: string): NavigationChange {
      connect();
      const to = history!.read();
      let from = current;
      let kind: NavigationChange["kind"] = "unknown";
      if (from && to) {
        if (to.key === from.key || to.index === from.index) kind = "replace";
        else if (to.index < from.index) kind = "back";
        else kind = visited.has(to.key) ? "forward" : "push";
      }
      if (kind === "push") {
        // Query/hash-only history entries may not mount a new page boundary.
        // Use the actual predecessor when it still represents the OUT route.
        const predecessor = history!.previous();
        if (
          predecessor &&
          predecessor.index === to!.index - 1 &&
          normalizePath(new URL(predecessor.url).pathname) ===
            normalizePath(rawFrom)
        ) {
          from = predecessor;
        }
      }
      current = to;
      remember(from);
      remember(to);
      return {
        kind,
        direction: kind === "back" ? "backward" : "forward",
        from,
        to,
      };
    },
    dispose() {
      history?.dispose();
      history = null;
      current = null;
      visited.clear();
    },
  };
}
