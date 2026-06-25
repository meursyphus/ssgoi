import { type ElementType, type ReactNode } from "react";
import { useLocation } from "react-router";

export function SsgoiTransitionBoundary({
  children,
  as,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const { pathname } = useLocation();
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
