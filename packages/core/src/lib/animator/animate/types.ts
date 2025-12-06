/**
 * Animation Runner 공통 타입
 */

import type { SpringConfig } from "../spring-core";

/**
 * CSS 스타일 객체 타입
 */
export type StyleObject = Record<string, number | string>;

/**
 * Animation Controls - tick-runner와 css-runner 모두 동일한 인터페이스
 */
export interface AnimationControls {
  stop: () => void;
  getPosition: () => number;
  getVelocity: () => number;
  isRunning: () => boolean;
}

/**
 * Animation Options - 통합 옵션
 */
export interface AnimationOptions {
  from: number;
  to: number;
  spring: SpringConfig;
  velocity?: number;
  onComplete: () => void;
  onStart?: () => void;

  // 둘 중 하나만 사용
  tick?: (value: number) => void;
  css?: {
    element: HTMLElement;
    style: (progress: number) => StyleObject;
  };
}
