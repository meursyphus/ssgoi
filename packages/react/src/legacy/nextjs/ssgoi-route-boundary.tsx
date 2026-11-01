// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
"use client";

import type { ElementType, ReactNode } from "react";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import {
  SuspendedFrameworkBoundary,
  type SsgoiFramework,
} from "../../layout-boundary";
import { toBoundary, type RouteBoundaryProps } from "../route-boundary";

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export interface NextjsRouteLocation {
  pathname: string;
  /** Segments below the layout that renders this boundary, including groups. */
  selectedSegments: string[];
}

/**
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export type SsgoiRouteBoundaryProps<T extends ElementType = "div"> =
  RouteBoundaryProps<NextjsRouteLocation, T> & {
    /** The parallel slot to read, without @. Defaults to children. */
    parallelRoutesKey?: string;
    /** Shown while Next.js resolves URL data (including Cache Components). */
    fallback?: ReactNode;
  };

const framework: SsgoiFramework = {
  useRoute: ({ parallelRoutesKey = "children" }) => {
    const pathname = usePathname();
    const selectedSegments = useSelectedLayoutSegments(parallelRoutesKey) ?? [];
    return pathname == null ? null : { pathname, selectedSegments };
  },
};

/**
 * App Router boundary. Import only from @ssgoi/react/nextjs.
 *
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from
 * "@ssgoi/react" with `<Ssgoi framework={...}>` instead.
 */
export function SsgoiRouteBoundary<T extends ElementType = "div">({
  resolve,
  routeKey,
  ...props
}: SsgoiRouteBoundaryProps<T>) {
  return (
    <SuspendedFrameworkBoundary
      {...props}
      boundary={toBoundary(resolve, routeKey)}
      framework={framework}
    />
  );
}
