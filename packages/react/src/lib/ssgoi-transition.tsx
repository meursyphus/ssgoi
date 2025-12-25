"use client";

import type { ReactNode, ElementType, CSSProperties } from "react";
import { transition } from "./transition";
import { useSsgoi } from "./context";

type SsgoiTransitionProps<T extends ElementType = "div"> = {
  children: ReactNode;
  id: string;
  as?: T;
  className?: string;
  style?: CSSProperties;
};

export const SsgoiTransition = <T extends ElementType = "div">({
  children,
  id,
  as,
  className,
  style,
  ...rest
}: SsgoiTransitionProps<T>) => {
  const { getTransition, getInitialStyle } = useSsgoi();
  const Component = as || "div";
  const initialStyle = getInitialStyle(id);

  return (
    <Component
      ref={transition(getTransition(id))}
      data-ssgoi-transition={id}
      className={className}
      style={{ ...style, ...initialStyle }}
      {...rest}
    >
      {children}
    </Component>
  );
};
