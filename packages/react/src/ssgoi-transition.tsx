"use client";

import type { ReactNode, ElementType } from "react";

type SsgoiTransitionProps<T extends ElementType = "div"> = {
  children: ReactNode;
  id: string;
  as?: T;
  className?: string;
};

/**
 * Marks a subtree as a Ssgoi page boundary.
 *
 * @deprecated Set `data-ssgoi-transition` directly on the page boundary
 * element inside `<Ssgoi>` instead.
 */
export const SsgoiTransition = <T extends ElementType = "div">({
  children,
  id,
  as,
  className,
  ...rest
}: SsgoiTransitionProps<T>) => {
  const Component = as || "div";
  return (
    <Component data-ssgoi-transition={id} className={className} {...rest}>
      {children}
    </Component>
  );
};
