"use client";

import type { ElementType } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  RouteBoundary,
  type RouteBoundaryProps,
  type RouteLocation,
} from "./route-boundary";

export type SsgoiRouteBoundaryProps<T extends ElementType = "div"> =
  RouteBoundaryProps<RouteLocation, T>;

/** @experimental TanStack Router integration. The API may change. */
export function SsgoiRouteBoundary<T extends ElementType = "div">({
  resolve,
  ...props
}: SsgoiRouteBoundaryProps<T>) {
  const pathname = useRouterState({ select: renderedPathname });
  const location = { pathname };
  const boundary = resolve?.(location) ?? { id: location.pathname };
  return <RouteBoundary {...props} boundary={boundary} />;
}

/**
 * The path of the leaf match the outlet is rendering. TanStack Router moves
 * `location` before pending matches render, so keying by it re-keys the
 * boundary while the outlet still shows the outgoing page: the incoming
 * boundary holds the old screen, and shared-element effects like zoom find
 * no target. Index routes match as "/parent/", so the location's own
 * trailing-slash style wins.
 */
function renderedPathname(state: {
  location: { pathname: string };
  matches?: ReadonlyArray<{ pathname: string }>;
}): string {
  const location = state.location.pathname;
  const leaf = state.matches?.[state.matches.length - 1]?.pathname;
  if (!leaf) return location;
  return leaf.length > 1 && leaf.endsWith("/") && !location.endsWith("/")
    ? leaf.slice(0, -1)
    : leaf;
}

export type { RouteBoundaryState } from "./route-boundary";
