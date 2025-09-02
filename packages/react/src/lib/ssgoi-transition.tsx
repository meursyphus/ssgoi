"use client";

import type { ReactNode, ElementType } from "react";
import { transition } from "./transition";
import { useSsgoi } from "./context";

type SsgoiTransitionProps<T extends ElementType = "div"> = {
  children: ReactNode;
  id: string;
  as?: T;
  className?: string;
};

export const SsgoiTransition = <T extends ElementType = "div">({
  children,
  id,
  as,
  className,
  ...rest
}: SsgoiTransitionProps<T>) => {
  const getTransition = useSsgoi();
  const Component = as || "div";

  return (
    <Component
      ref={transition(getTransition(id))}
      data-ssgoi-transition={id}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
};
