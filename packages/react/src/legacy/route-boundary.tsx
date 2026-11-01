// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
"use client";

import {
  Suspense,
  type ComponentPropsWithoutRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export interface RouteBoundaryState {
  id: string;
  /** Defaults to id. Keep this stable while a nested layout owns navigation. */
  key?: string | number;
}

export interface RouteLocation {
  pathname: string;
}

export type RouteBoundaryProps<
  Location extends RouteLocation = RouteLocation,
  T extends ElementType = "div",
> = {
  children?: ReactNode;
  as?: T;
  /** A stable lifetime for a boundary inside a persistent route layout. */
  routeKey?: string | number;
  /** Resolve the logical route and its lifetime together during render. */
  resolve?: (location: Location) => RouteBoundaryState;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "children" | "resolve" | "routeKey"
>;

/** Reads the route with the subpath's own router hooks; `null` while not ready. */
export type UseRoute = (options: {
  parallelRoutesKey?: string;
}) => RouteLocation | null;

type LegacyBoundaryProps = HTMLAttributes<HTMLElement> & {
  useRoute: UseRoute;
  as?: ElementType;
  routeKey?: string | number;
  // Every resolver is assignable to this; each subpath types its own location.
  resolve?: (location: never) => RouteBoundaryState;
  parallelRoutesKey?: string;
  fallback?: ReactNode;
};

/** Catches URL suspension outside the hooks that throw it. */
export function SuspendedRouteBoundary(props: LegacyBoundaryProps) {
  return (
    <Suspense fallback={props.fallback ?? null}>
      <RouteBoundary {...props} />
    </Suspense>
  );
}

export function RouteBoundary({
  useRoute,
  resolve,
  routeKey,
  parallelRoutesKey,
  fallback,
  as,
  children,
  ...rest
}: LegacyBoundaryProps) {
  const route = useRoute({ parallelRoutesKey });

  // In a mixed app/pages project Next may not have initialized the router yet.
  // Never register an empty or invented route with SSGOI.
  if (route == null) return fallback ?? null;

  const boundary = resolve?.(route as never) ?? { id: route.pathname };
  const Component: ElementType = as ?? "div";
  return (
    <Component
      {...rest}
      key={routeKey ?? boundary.key ?? boundary.id}
      data-ssgoi-transition={boundary.id}
    >
      {children}
    </Component>
  );
}
