"use client";

import type { ElementType } from "react";
import { useLocation, type Location } from "react-router";
import { RouteBoundary, type RouteBoundaryProps } from "./route-boundary";

export type SsgoiRouteBoundaryProps<T extends ElementType = "div"> =
  RouteBoundaryProps<Location, T>;

/** @experimental React Router integration. The API may change. */
export function SsgoiRouteBoundary<T extends ElementType = "div">({
  resolve,
  ...props
}: SsgoiRouteBoundaryProps<T>) {
  const location = useLocation();
  const boundary = resolve?.(location) ?? { id: location.pathname };
  return <RouteBoundary {...props} boundary={boundary} />;
}

export type { RouteBoundaryState } from "./route-boundary";
