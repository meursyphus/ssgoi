"use client";

import { type ElementType, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export type BoundaryName = "page" | "products-shell";

function resolveBoundary(name: BoundaryName, pathname: string) {
  return {
    id: pathname,
    key: name === "products-shell" ? "products-layout" : pathname,
  };
}

export function SsgoiRouteBoundary({
  children,
  name,
  as,
  className,
}: {
  children: ReactNode;
  /**
   * Selects this template's centralized route-id/key policy.
   * `products-shell` is safe because the products layout owns its lifetime.
   */
  name: BoundaryName;
  as?: ElementType;
  className?: string;
}) {
  const pathname = usePathname();
  const Component = as ?? "div";
  const boundary = resolveBoundary(name, pathname);

  return (
    <Component
      key={boundary.key}
      data-ssgoi-transition={boundary.id}
      className={className}
    >
      {children}
    </Component>
  );
}
