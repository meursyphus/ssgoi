import type { LayoutScope } from "../runtime/types";
import { getBestPathMatch } from "./path-pattern";

/**
 * Walk the layout tree for `path`, taking the first matching scope at each
 * level until none matches. Each entry identifies one scope instance: its tree
 * position ("1.0") plus the segments captured by `*` / `:id` / `[id]`, so
 * `/projects/1/files` and `/projects/1/members` share an entry under
 * `/projects/:id/**` while `/projects/2` does not. `**` tails are not part of
 * the entry.
 */
export function resolveLayoutChain(
  layouts: readonly LayoutScope[] | undefined,
  path: string,
): string[] {
  const chain: string[] = [];
  let level = layouts;
  let position = "";

  while (level) {
    let next: LayoutScope | undefined;
    for (const [index, scope] of level.entries()) {
      const match = getBestPathMatch(path, scope.paths);
      if (!match) continue;
      if (scope.except !== undefined && getBestPathMatch(path, scope.except)) {
        continue;
      }
      position = position ? `${position}.${index}` : `${index}`;
      chain.push([position, ...match.captures].join("/"));
      next = scope;
      break;
    }
    if (!next) break;
    level = next.layouts;
  }

  return chain;
}
