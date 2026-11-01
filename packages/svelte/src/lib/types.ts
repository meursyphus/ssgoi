import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export * from "@ssgoi/core/types";

/**
 * Router members `SsgoiLayoutBoundary` reads through `<Ssgoi framework>`.
 *
 * SvelteKit 2.12+: `{ getRoute: () => ({ pathname: page.url.pathname, url:
 * page.url }), onNavigate }` from `$app/state` and `$app/navigation`. Earlier
 * SvelteKit 2: read `get(page).url` with `page` from `$app/stores`.
 */
export interface SsgoiFramework {
  /** Read once for the initial boundary; a `boundary` function receives it as returned. */
  getRoute: () => { pathname: string; url: URL };
  onNavigate: (
    callback: (navigation: { to: { url: URL } | null }) => void | (() => void),
  ) => void;
}

type BoundaryResult = { id?: string; key?: string | number };

export interface SsgoiLayoutBoundaryProps extends HTMLAttributes<HTMLElement> {
  children: Snippet;
  as?: keyof HTMLElementTagNameMap;
  /**
   * A string is a fixed key; an object fixes `id` and/or `key`; a function
   * computes either from the route. `id` defaults to the pathname, `key` to `id`.
   */
  boundary?:
    | string
    | BoundaryResult
    | ((route: { pathname: string; url: URL }) => string | BoundaryResult);
}
