"use client";

import type { ReactNode, ElementType } from "react";
import { useSsgoi } from "./context";

type SsgoiTransitionProps<T extends ElementType = "div"> = {
  children: ReactNode;
  id: string;
  as?: T;
  className?: string;
};

/**
 * Marks a subtree as a Ssgoi page boundary.
 *
 * The ssgoi context hands out a stable, path-bound ref callback via
 * `refFor(id)` — the same function reference across renders for the same
 * id, so React doesn't see a fresh ref each commit and won't churn the
 * attach/detach cycle. Unmount is detected internally via the shared
 * MutationObserver in the dispatcher; nothing extra to wire up here.
 */
export const SsgoiTransition = <T extends ElementType = "div">({
  children,
  id,
  as,
  className,
  ...rest
}: SsgoiTransitionProps<T>) => {
  const { refFor } = useSsgoi();
  const Component = as || "div";
  return (
    <Component
      ref={refFor(id)}
      data-ssgoi-transition={id}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
};
