import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export * from "@ssgoi/core/types";

/**
 * Router members `<Ssgoi>` reads for `SsgoiLayoutBoundary`.
 *
 * SvelteKit 2.12+: `{ getRoute: () => ({ pathname: page.url.pathname }),
 * onNavigate }` from `$app/state` and `$app/navigation`. Earlier SvelteKit 2:
 * read `get(page).url` with `page` from `$app/stores`.
 */
export interface SsgoiFramework {
  /** The route a boundary mounts on. */
  getRoute: () => { pathname: string };
  onNavigate: (
    callback: (navigation: { to: { url: URL } | null }) => void | (() => void),
  ) => void;
}

/**
 * A boundary's id is the pathname; at depth N (counted through enclosing
 * boundaries) it stays mounted while navigation stays inside the same depth-N
 * scope of `config.layouts`.
 */
export interface SsgoiLayoutBoundaryProps extends HTMLAttributes<HTMLElement> {
  children: Snippet;
  as?: keyof HTMLElementTagNameMap;
}
