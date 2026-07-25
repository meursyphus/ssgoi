import { type ElementType, type ReactNode } from "react";
import { useLocation } from "react-router";

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
  name: BoundaryName;
  as?: ElementType;
  className?: string;
}) {
  const { pathname } = useLocation();
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
