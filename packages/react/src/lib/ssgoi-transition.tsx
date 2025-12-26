"use client";

import { useRef, useCallback, useMemo } from "react";
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

  const setElementRef = useCallback((el: HTMLElement | null) => {
    elementRef.current = el;
    if (el) {
      isFirstRenderRef.current = false;
    }
  }, []);

  const transitionConfig = getTransition(id);
  const transitionRef = useMemo(
    () => transition(transitionConfig),
    [transitionConfig],
  );

  const combinedRef = useMemo(
    () => combineRefs<HTMLElement>(setElementRef, transitionRef),
    [setElementRef, transitionRef],
  );

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
