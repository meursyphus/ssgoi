import { createElement, type JSX } from "preact";

export interface SsgoiRouteBoundaryProps
  extends JSX.HTMLAttributes<HTMLElement> {
  /** Logical path used by transition rules. */
  id: string;
  /** DOM lifetime; defaults to id. Change it when the page instance changes. */
  routeKey?: string | number;
  as?: keyof HTMLElementTagNameMap;
}

/** Router-independent boundary that replaces its HTML element on navigation. */
export function SsgoiRouteBoundary({
  id,
  routeKey = id,
  as = "div",
  children,
  ...props
}: SsgoiRouteBoundaryProps): JSX.Element {
  return createElement(
    as,
    { ...props, key: routeKey, "data-ssgoi-transition": id },
    children,
  );
}
