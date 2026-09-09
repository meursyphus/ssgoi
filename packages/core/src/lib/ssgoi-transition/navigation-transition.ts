import type { NavigationDirection } from "@types";
import type { ResolvedTransitionRule } from "../runtime/resolve-transition-rule";
import { createNavigationDirectionTracker } from "./navigation-direction";

type Edge<T> = {
  source: string;
  index: number;
  from: string;
  to: string;
  rule: ResolvedTransitionRule<T> | null;
};

/** Remember effects per visited entry, without retaining page DOM or animations. */
export function createNavigationTransitionResolver<T>() {
  const tracker = createNavigationDirectionTracker();
  const arrivals = new Map<string, Edge<T>>();
  return {
    connect: tracker.connect,
    resolve(
      from: string,
      to: string,
      match: (
        direction: NavigationDirection,
      ) => ResolvedTransitionRule<T> | null,
    ): ResolvedTransitionRule<T> | null {
      const navigation = tracker.resolve(from, to);
      const source = navigation.from?.key;
      const destination = navigation.to?.key;
      if (navigation.kind === "back" && source && destination) {
        const edge = arrivals.get(source);
        if (
          edge?.source === destination &&
          edge.from === to &&
          edge.to === from
        ) {
          if (!edge.rule) return null;
          return {
            ...edge.rule,
            direction:
              edge.rule.direction === "forward" ? "backward" : "forward",
            preserveScroll: {
              from: edge.rule.preserveScroll.to,
              to: edge.rule.preserveScroll.from,
            },
          };
        }
      }
      if (navigation.kind === "forward" && source && destination) {
        const edge = arrivals.get(destination);
        if (edge?.source === source && edge.from === from && edge.to === to)
          return edge.rule;
      }

      const rule = match(navigation.direction);
      if (destination && navigation.kind === "replace")
        arrivals.delete(destination);
      if (destination && source && navigation.kind === "push") {
        // A new push after Back discards the old forward branch.
        for (const [key, edge] of arrivals) {
          if (edge.index >= navigation.to!.index) arrivals.delete(key);
        }
        arrivals.set(destination, {
          source,
          index: navigation.to!.index,
          from,
          to,
          rule: rule
            ? { ...rule, preserveScroll: { ...rule.preserveScroll } }
            : null,
        });
        // Keep the provider's memory bounded even in long-running sessions.
        if (arrivals.size > 100) arrivals.delete(arrivals.keys().next().value!);
      }
      return rule;
    },
    dispose() {
      tracker.dispose();
      arrivals.clear();
    },
  };
}
