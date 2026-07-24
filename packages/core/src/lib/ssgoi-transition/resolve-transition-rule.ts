import type {
  AnyTransitionConfig,
  NavigationDirection,
  SsgoiTransitionRule,
} from "@types";
import { getBestPathMatch } from "./path-pattern";

export type ResolvedTransitionRule = {
  transition: AnyTransitionConfig;
  direction: NavigationDirection;
  ruleIndex: number;
  priority: number;
  specificity: number;
  reason: "on-enter" | "on-leave" | "on-history" | "pair" | "ordered";
};

type Candidate = ResolvedTransitionRule;

function isBetter(candidate: Candidate, current: Candidate | null): boolean {
  if (!current) return true;
  if (candidate.priority !== current.priority) {
    return candidate.priority > current.priority;
  }
  if (candidate.specificity !== current.specificity) {
    return candidate.specificity > current.specificity;
  }
  return candidate.ruleIndex < current.ruleIndex;
}

/**
 * Resolve a flat route-rule list. `historyDirection` is consulted only when
 * the rule itself cannot prove a direction (both endpoints inside one `on`
 * scope, or an intentionally overlapping pair).
 */
export function resolveTransitionRule(
  from: string,
  to: string,
  rules: readonly SsgoiTransitionRule[],
  historyDirection: NavigationDirection,
): ResolvedTransitionRule | null {
  let best: Candidate | null = null;

  rules.forEach((rule, ruleIndex) => {
    const priority = rule.priority ?? 0;
    let candidate: Candidate | null = null;

    if (rule.on !== undefined) {
      const fromExcluded =
        rule.except !== undefined &&
        getBestPathMatch(from, rule.except) !== null;
      const toExcluded =
        rule.except !== undefined && getBestPathMatch(to, rule.except) !== null;
      const fromMatch = fromExcluded ? null : getBestPathMatch(from, rule.on);
      const toMatch = toExcluded ? null : getBestPathMatch(to, rule.on);

      if (fromMatch || toMatch) {
        const direction =
          !fromMatch && toMatch
            ? "forward"
            : fromMatch && !toMatch
              ? "backward"
              : historyDirection;
        candidate = {
          transition: rule.transition,
          direction,
          ruleIndex,
          priority,
          specificity: Math.max(
            fromMatch?.specificity ?? 0,
            toMatch?.specificity ?? 0,
          ),
          reason:
            !fromMatch && toMatch
              ? "on-enter"
              : fromMatch && !toMatch
                ? "on-leave"
                : "on-history",
        };
      }
    } else if (rule.ordered !== undefined) {
      let fromIndex = -1;
      let toIndex = -1;
      let fromSpecificity = -1;
      let toSpecificity = -1;

      rule.ordered.forEach((pattern, index) => {
        const fromMatch = getBestPathMatch(from, pattern);
        if (fromMatch && fromMatch.specificity > fromSpecificity) {
          fromIndex = index;
          fromSpecificity = fromMatch.specificity;
        }
        const toMatch = getBestPathMatch(to, pattern);
        if (toMatch && toMatch.specificity > toSpecificity) {
          toIndex = index;
          toSpecificity = toMatch.specificity;
        }
      });

      if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
        candidate = {
          transition: rule.transition,
          direction: fromIndex < toIndex ? "forward" : "backward",
          ruleIndex,
          priority,
          specificity: fromSpecificity + toSpecificity,
          reason: "ordered",
        };
      }
    } else {
      const directFrom = getBestPathMatch(from, rule.from);
      const directTo = getBestPathMatch(to, rule.to);
      const reverseFrom =
        rule.bidirectional === false ? null : getBestPathMatch(from, rule.to);
      const reverseTo =
        rule.bidirectional === false ? null : getBestPathMatch(to, rule.from);
      const direct = directFrom && directTo;
      const reverse = reverseFrom && reverseTo;

      if (direct || reverse) {
        const directSpecificity = direct
          ? directFrom.specificity + directTo.specificity
          : -1;
        const reverseSpecificity = reverse
          ? reverseFrom.specificity + reverseTo.specificity
          : -1;
        const direction =
          direct && reverse && directSpecificity === reverseSpecificity
            ? historyDirection
            : directSpecificity >= reverseSpecificity
              ? "forward"
              : "backward";
        candidate = {
          transition: rule.transition,
          direction,
          ruleIndex,
          priority,
          specificity: Math.max(directSpecificity, reverseSpecificity),
          reason: "pair",
        };
      }
    }

    if (candidate && isBetter(candidate, best)) best = candidate;
  });

  return best;
}
