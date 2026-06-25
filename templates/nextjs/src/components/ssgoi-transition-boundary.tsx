"use client";

import { type ElementType, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SsgoiTransitionBoundary({
  children,
  as,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const pathname = usePathname();
  const Component = as ?? "div";

  return (
    <Component
      key={pathname}
      data-ssgoi-transition={pathname}
      className={className}
    >
      {children}
    </Component>
  );
}
