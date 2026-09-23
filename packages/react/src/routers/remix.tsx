"use client";

import type { ElementType } from "react";
import { useLocation } from "@remix-run/react";
import { RouteBoundary, type RouteBoundaryProps } from "./route-boundary";

export type RemixRouteLocation = ReturnType<typeof useLocation>;
export type SsgoiRouteBoundaryProps<T extends ElementType = "div"> =
  RouteBoundaryProps<RemixRouteLocation, T>;

/** @experimental Remix 2 integration. The API may change. */
export function SsgoiRouteBoundary<T extends ElementType = "div">({
  resolve,
  ...props
}: SsgoiRouteBoundaryProps<T>) {
  const location = useLocation();
  const boundary = resolve?.(location) ?? { id: location.pathname };
  return <RouteBoundary {...props} boundary={boundary} />;
}

export type { RouteBoundaryState } from "./route-boundary";
