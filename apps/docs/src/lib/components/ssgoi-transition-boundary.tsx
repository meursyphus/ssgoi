"use client";

import { type ElementType, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SsgoiTransitionBoundary({
  children,
  as,
  className,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const pathname = usePathname();
  const transitionId = id ?? pathname;
  const Component = as ?? "div";

  return (
    <Component
      key={transitionId}
      data-ssgoi-transition={transitionId}
      className={className}
    >
      {children}
    </Component>
  );
}
