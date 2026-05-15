"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";

export interface UseMobileResult {
  isMobile: boolean;
  detected: boolean;
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
  const [state, setState] = useState<UseMobileResult>({
    isMobile: false,
    detected: false,
  });

  useEffect(() => {
    // Media query를 사용한 반응형 감지
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const updateMobileState = () => {
      setState({
        isMobile: mediaQuery.matches,
        detected: true,
      });
    };

    // 초기 감지
    updateMobileState();

    // 화면 크기 변경 감지
    mediaQuery.addEventListener("change", updateMobileState);

    return () => {
      mediaQuery.removeEventListener("change", updateMobileState);
    };
  }, [breakpoint]);

  return state;
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
  const [state, setState] = useState<UseMobileResult>({
    isMobile: false,
    detected: false,
  });

  useEffect(() => {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;

    // 모바일 디바이스 패턴 감지
    const isMobileDevice =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase(),
      );

    setState({
      isMobile: isMobileDevice,
      detected: true,
    });
  }, []);

  return state;
}
