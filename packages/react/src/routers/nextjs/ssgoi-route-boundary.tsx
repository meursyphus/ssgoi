"use client";

import { Suspense, type ElementType, type ReactNode } from "react";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { RouteBoundary, type RouteBoundaryProps } from "../route-boundary";

export interface NextjsRouteLocation {
  pathname: string;
  /** Segments below the layout that renders this boundary, including groups. */
  selectedSegments: string[];
}

export type SsgoiRouteBoundaryProps<T extends ElementType = "div"> =
  RouteBoundaryProps<NextjsRouteLocation, T> & {
    /** The parallel slot to read, without @. Defaults to children. */
    parallelRoutesKey?: string;
    /** Shown while Next.js resolves URL data (including Cache Components). */
    fallback?: ReactNode;
  };

/** App Router boundary. Import only from @ssgoi/react/nextjs. */
export function SsgoiRouteBoundary<T extends ElementType = "div">(
  props: SsgoiRouteBoundaryProps<T>,
) {
  return (
    <Suspense fallback={props.fallback ?? null}>
      <ResolvedBoundary<T> {...props} />
    </Suspense>
  );
}

function ResolvedBoundary<T extends ElementType = "div">({
  resolve,
  parallelRoutesKey = "children",
  fallback,
  ...props
}: SsgoiRouteBoundaryProps<T>) {
  const pathname = usePathname();
  const selectedSegments = useSelectedLayoutSegments(parallelRoutesKey) ?? [];

  // In a mixed app/pages project Next may not have initialized the router yet.
  // Never register an empty or invented route with SSGOI.
  if (pathname == null) return fallback ?? null;

  const boundary = resolve?.({ pathname, selectedSegments }) ?? {
    id: pathname,
  };
  return <RouteBoundary {...props} boundary={boundary} />;
}
