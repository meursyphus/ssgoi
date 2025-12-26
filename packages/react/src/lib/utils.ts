import type { CSSProperties } from "react";

/**
 * Combines multiple ref callbacks into one
 */
export function combineRefs<T>(
  ...refs: Array<((el: T | null) => void) | null | undefined>
): (el: T | null) => void {
  return (el: T | null) => {
    refs.forEach((ref) => ref?.(el));
  };
}

/**
 * Forks style from element.style based on initialStyle keys
 * Returns the current DOM style values for keys that were in initialStyle
 */
export function forkStyleFromElement(
  element: HTMLElement,
  initialStyle: CSSProperties,
): CSSProperties {
  const forkedStyle: CSSProperties = {};

  for (const key of Object.keys(initialStyle) as Array<keyof CSSProperties>) {
    const value = element.style[key as keyof CSSStyleDeclaration];
    if (value) {
      (forkedStyle as Record<string, unknown>)[key] = value;
    }
  }

  return forkedStyle;
}
