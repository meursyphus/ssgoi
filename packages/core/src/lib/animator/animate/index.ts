/**
 * Animate Module
 *
 * 통합 애니메이션 인터페이스
 * tick 또는 css 옵션에 따라 내부적으로 적절한 runner 선택
 */

import { runTickAnimation } from "./tick-runner";
import { runCssAnimation } from "./css-runner";
import type { AnimationControls, AnimationOptions } from "./types";

export type { AnimationControls, AnimationOptions };

/**
 * Spring 애니메이션 실행
 *
 * tick 옵션 사용 시: RAF 기반 실시간 애니메이션
 * css 옵션 사용 시: Web Animation API 기반 (GPU 가속)
 *
 * @example
 * ```ts
 * // Tick mode (RAF)
 * const controls = animate({
 *   from: 0,
 *   to: 1,
 *   spring: { stiffness: 300, damping: 30 },
 *   tick: (value) => element.style.opacity = String(value),
 *   onComplete: () => console.log('done'),
 * });
 *
 * // CSS mode (Web Animation API)
 * const controls = animate({
 *   from: 0,
 *   to: 1,
 *   spring: { stiffness: 300, damping: 30 },
 *   css: {
 *     element: myElement,
 *     keyframe: (progress) => ({
 *       opacity: String(progress),
 *       transform: `scale(${0.5 + 0.5 * progress})`,
 *     }),
 *   },
 *   onComplete: () => console.log('done'),
 * });
 *
 * // 중간에 중지하고 상태 확인
 * controls.stop();
 * console.log(controls.getPosition()); // 현재 위치
 * console.log(controls.getVelocity()); // 현재 속도
 * ```
 */
export function animate(options: AnimationOptions): AnimationControls {
  const { from, to, spring, velocity, onComplete, onStart, tick, css } =
    options;

  // Validation
  if (tick && css) {
    throw new Error("Cannot use both 'tick' and 'css' options together");
  }

  if (!tick && !css) {
    throw new Error("Either 'tick' or 'css' option is required");
  }

  // CSS mode
  if (css) {
    return runCssAnimation({
      element: css.element,
      from,
      to,
      spring,
      velocity,
      style: css.style,
      onComplete,
      onStart,
    });
  }

  // Tick mode
  return runTickAnimation({
    from,
    to,
    spring,
    velocity,
    onUpdate: tick!,
    onComplete,
    onStart,
  });
}
