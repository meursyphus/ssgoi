import { createElement, type JSX } from "preact";

export interface SsgoiTransitionProps extends JSX.HTMLAttributes<HTMLElement> {
  id: string;
  as?: keyof HTMLElementTagNameMap;
}

/** @deprecated Prefer `data-ssgoi-transition` on your page's HTML element. */
export function SsgoiTransition({
  id,
  as = "div",
  children,
  ...props
}: SsgoiTransitionProps): JSX.Element {
  return createElement(as, { ...props, "data-ssgoi-transition": id }, children);
}
