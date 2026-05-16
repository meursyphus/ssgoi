"use client";

import { useSyncExternalStore } from "react";

export interface UseMobileResult {
  isMobile: boolean;
  detected: boolean;
}

function subscribeToMediaQuery(query: string, onChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function subscribeToStaticValue() {
  return () => {};
}

type WindowWithOpera = Window & { opera?: string };

function detectMobileDevice() {
  const opera = (window as WindowWithOpera).opera ?? "";
  const userAgent = navigator.userAgent || navigator.vendor || opera;

  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase(),
  );
}

/**
 * 모바일 디바이스 감지 훅
 *
 * @param breakpoint - 모바일로 간주할 최대 너비 (기본값: 768px)
 * @returns {UseMobileResult} isMobile과 detected 상태
 *
 * @example
 * ```tsx
 * const { isMobile, detected } = useMobile();
 *
 * if (!detected) {
 *   return <Skeleton />; // SSR 중이거나 아직 감지 전
 * }
 *
 * return isMobile ? <MobileView /> : <DesktopView />;
 * ```
 */
export function useMobile(breakpoint: number = 768): UseMobileResult {
  const query = `(max-width: ${breakpoint}px)`;
  const isMobile = useSyncExternalStore(
    (onChange) => subscribeToMediaQuery(query, onChange),
    () => window.matchMedia(query).matches,
    () => null,
  );

  return {
    isMobile: isMobile ?? false,
    detected: isMobile !== null,
  };
}

/**
 * User Agent 기반 모바일 감지 훅 (디바이스 타입 감지)
 * 화면 크기가 아닌 실제 디바이스 타입을 감지합니다.
 *
 * @returns {UseMobileResult} isMobile과 detected 상태
 *
 * @example
 * ```tsx
 * const { isMobile, detected } = useMobileDevice();
 * ```
 */
export function useMobileDevice(): UseMobileResult {
  const isMobile = useSyncExternalStore(
    subscribeToStaticValue,
    detectMobileDevice,
    () => null,
  );

  return {
    isMobile: isMobile ?? false,
    detected: isMobile !== null,
  };
}
