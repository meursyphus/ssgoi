"use client";

import {
  Suspense,
  useContext,
  type ComponentPropsWithoutRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ssgoiContext } from "./context";

/**
 * How `SsgoiLayoutBoundary` reads the router, passed to `<Ssgoi framework>`.
 * Keep the object stable.
 */
export interface SsgoiFramework {
  /**
   * A hook returning the current route, or `null` while the router isn't
   * ready (renders `fallback`). `resolve` receives the returned object, so
   * extra fields such as `search` or `selectedSegments` pass through.
   */
  useRoute: (options: { parallelRoutesKey?: string }) => {
    pathname: string;
  } | null;
}

/** A fixed id and/or key; id defaults to the pathname, key to the id. */
type BoundaryResult = { id?: string; key?: string | number };

/**
 * A string is the boundary's key (its lifetime) and leaves the id as the
 * pathname. A function computes either form from the route.
 */
type BoundaryInput<Route> =
  | string
  | BoundaryResult
  | ((route: Route) => string | BoundaryResult);

export interface SsgoiLayoutLocation {
  pathname: string;
  /** The rest of the object `framework.useRoute` returned. */
  [key: string]: unknown;
}

/**
 * `Route` is what a `boundary` function receives: annotate its parameter with
 * the shape your `framework.useRoute` returns.
 */
export type SsgoiLayoutBoundaryProps<
  T extends ElementType = "div",
  Route extends object = SsgoiLayoutLocation,
> = {
  children?: ReactNode;
  as?: T;
  /** The boundary's key, id and key, or a function of the route returning either. */
  boundary?: BoundaryInput<Route>;
  /** Passed to `framework.useRoute`, e.g. a Next.js slot without @. */
  parallelRoutesKey?: string;
  /** Shown while the router resolves URL data (including Cache Components). */
  fallback?: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "children" | "boundary" | "parallelRoutesKey" | "fallback"
>;

type FrameworkBoundaryProps = HTMLAttributes<HTMLElement> & {
  framework: SsgoiFramework;
  as?: ElementType;
  // Every route function is assignable to this; each caller types its own route.
  boundary?: BoundaryInput<never>;
  parallelRoutesKey?: string;
  fallback?: ReactNode;
};

/**
 * A keyed route boundary for the layout that renders it. Reads the router
 * hooks from `<Ssgoi framework>`.
 */
export function SsgoiLayoutBoundary<
  T extends ElementType = "div",
  Route extends object = SsgoiLayoutLocation,
>(props: SsgoiLayoutBoundaryProps<T, Route>) {
  const framework = useContext(ssgoiContext)?.framework;
  if (!framework) {
    throw new Error(
      "SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi framework={{ useRoute }}>.",
    );
  }
  return (
    <SuspendedFrameworkBoundary
      {...(props as Omit<FrameworkBoundaryProps, "framework">)}
      framework={framework}
    />
  );
}

/** @internal Catches URL suspension outside the hooks that throw it. */
export function SuspendedFrameworkBoundary(props: FrameworkBoundaryProps) {
  return (
    <Suspense fallback={props.fallback ?? null}>
      <FrameworkBoundary {...props} />
    </Suspense>
  );
}

/** @internal Shared by the deprecated router subpaths. */
export function FrameworkBoundary({
  framework,
  boundary,
  parallelRoutesKey,
  fallback,
  as,
  children,
  ...rest
}: FrameworkBoundaryProps) {
  const resolver = typeof boundary === "function" ? boundary : () => boundary;
  const route = framework.useRoute({ parallelRoutesKey });

  // In a mixed app/pages project Next may not have initialized the router yet.
  // Never register an empty or invented route with SSGOI.
  if (route == null) return fallback ?? null;

  const result = resolver(route as never);
  const normalized =
    typeof result === "string" ? { key: result } : (result ?? {});
  const id = normalized.id ?? route.pathname;
  const Component: ElementType = as ?? "div";
  return (
    <Component {...rest} key={normalized.key ?? id} data-ssgoi-transition={id}>
      {children}
    </Component>
  );
}
