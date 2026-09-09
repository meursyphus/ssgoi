"use client";

import type { ElementType } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  RouteBoundary,
  type RouteBoundaryProps,
  type RouteLocation,
} from "../route-boundary";

export type SsgoiRouteBoundaryProps<T extends ElementType = "div"> =
  RouteBoundaryProps<RouteLocation, T>;

export function SsgoiRouteBoundary<T extends ElementType = "div">({
  resolve,
  ...props
}: SsgoiRouteBoundaryProps<T>) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const location = { pathname };
  const boundary = resolve?.(location) ?? { id: location.pathname };
  return <RouteBoundary {...props} boundary={boundary} />;
}
