// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
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
 * @deprecated Will be removed in 8.0.0.
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
