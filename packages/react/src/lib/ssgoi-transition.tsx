"use client";

import { useRef } from "react";
import type { ReactNode, ElementType, CSSProperties } from "react";
import { transition } from "./transition";
import { useSsgoi } from "./context";
import { combineRefs, forkStyleFromElement } from "./utils";

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
  const { getTransition, getInitialStyle } = useSsgoi();
  const Component = as || "div";

  const elementRef = useRef<HTMLElement | null>(null);
  const isFirstRenderRef = useRef(true);
  const initialStyleRef = useRef<CSSProperties | null>(null);
  console.log("asdf!!!@@@@@@@@@@");
  // Calculate initial style once
  if (initialStyleRef.current === null) {
    initialStyleRef.current = getInitialStyle();
  }

  // Determine current style
  let currentStyle: CSSProperties | undefined;

  if (isFirstRenderRef.current) {
    // First render: use initialStyle
    currentStyle = initialStyleRef.current;
  } else if (elementRef.current && initialStyleRef.current) {
    // Subsequent renders: fork from element.style to sync with DOM
    currentStyle = forkStyleFromElement(
      elementRef.current,
      initialStyleRef.current,
    );
  }

  const transitionRef = transition(getTransition(id));

  const combinedRef = combineRefs<HTMLElement>((el) => {
    elementRef.current = el;
    isFirstRenderRef.current = false;
  }, transitionRef);

  return (
    <Component
      ref={combinedRef}
      data-ssgoi-transition={id}
      className={className}
      style={currentStyle}
      {...rest}
    >
      {children}
    </Component>
  );
};
