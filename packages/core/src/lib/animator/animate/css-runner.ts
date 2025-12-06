/**
 * CSS Runner (Web Animation API 기반 Spring 애니메이션)
 *
 * Spring 물리를 미리 시뮬레이션하여 keyframe으로 변환 후
 * Web Animation API로 실행.
 *
 * 시뮬레이션 데이터를 기록해두어 중간에 stop 시
 * 정확한 position과 velocity를 역산할 수 있음.
 */

import {
  computeSpringConstants,
  stepSpring,
  isSettled,
  SETTLE_THRESHOLD,
  type SpringState,
  type SpringConfig,
} from "../spring-core";
import type { AnimationControls, StyleObject } from "./types";

export interface CssRunnerOptions {
  element: HTMLElement;
  from: number;
  to: number;
  spring: SpringConfig;
  velocity?: number;
  style: (progress: number) => StyleObject;
  onComplete: () => void;
  onStart?: () => void;
}

/**
 * 시뮬레이션 프레임 데이터
 */
interface SimulationFrame {
  time: number; // ms
  position: number;
  velocity: number;
}

const FRAME_TIME = 1000 / 60; // ~16.67ms per frame

/**
 * Spring 전체 시뮬레이션 (동기적)
 * position, velocity를 시간별로 기록
 */
function simulateSpring(
  from: number,
  to: number,
  spring: SpringConfig,
  initialVelocity = 0,
): SimulationFrame[] {
  const constants = computeSpringConstants(spring);
  const MAX_FRAMES = 600; // 최대 10초

  let state: SpringState = { position: from, velocity: initialVelocity };
  let settleTime = 0;
  const frames: SimulationFrame[] = [];

  for (let i = 0; i < MAX_FRAMES; i++) {
    const time = i * FRAME_TIME;

    // 현재 상태 기록
    frames.push({
      time,
      position: state.position,
      velocity: state.velocity,
    });

    // Spring 스텝 (초 단위로 변환)
    state = stepSpring(state, to, constants, FRAME_TIME / 1000);

    // 수렴 체크
    if (isSettled(state, to)) {
      settleTime += FRAME_TIME / 1000;
      if (settleTime >= SETTLE_THRESHOLD) {
        // 마지막 프레임 - 정확히 목표값
        frames.push({
          time: (i + 1) * FRAME_TIME,
          position: to,
          velocity: 0,
        });
        break;
      }
    } else {
      settleTime = 0;
    }
  }

  return frames;
}

/**
 * 경과 시간에서 position과 velocity를 역산
 * 이진 탐색 + 선형 보간
 */
function interpolateFrame(
  frames: SimulationFrame[],
  elapsedTime: number,
): { position: number; velocity: number } {
  if (frames.length === 0) {
    return { position: 0, velocity: 0 };
  }

  const firstFrame = frames[0]!;
  const lastFrame = frames[frames.length - 1]!;

  // 범위 체크
  if (elapsedTime <= 0) {
    return { position: firstFrame.position, velocity: firstFrame.velocity };
  }

  if (elapsedTime >= lastFrame.time) {
    return { position: lastFrame.position, velocity: lastFrame.velocity };
  }

  // 이진 탐색으로 프레임 찾기
  let low = 0;
  let high = frames.length - 1;

  while (low < high - 1) {
    const mid = Math.floor((low + high) / 2);
    if (frames[mid]!.time <= elapsedTime) {
      low = mid;
    } else {
      high = mid;
    }
  }

  // 선형 보간
  const f1 = frames[low]!;
  const f2 = frames[high]!;
  const t = (elapsedTime - f1.time) / (f2.time - f1.time);

  return {
    position: f1.position + (f2.position - f1.position) * t,
    velocity: f1.velocity + (f2.velocity - f1.velocity) * t,
  };
}

/**
 * SimulationFrame[] -> Keyframe[]
 */
function framesToKeyframes(
  frames: SimulationFrame[],
  from: number,
  to: number,
  styleFn: (progress: number) => StyleObject,
): Keyframe[] {
  const range = to - from;

  return frames.map((frame) => {
    // position을 0~1 progress로 변환
    const progress = range !== 0 ? (frame.position - from) / range : 1;
    const clampedProgress = Math.max(0, Math.min(1, progress));
    return styleFn(clampedProgress) as Keyframe;
  });
}

/**
 * Web Animation API 기반 Spring 애니메이션 실행
 */
export function runCssAnimation(options: CssRunnerOptions): AnimationControls {
  const {
    element,
    from,
    to,
    spring,
    velocity: initialVelocity = 0,
    style: styleFn,
    onComplete,
    onStart,
  } = options;

  // Phase 1: 시뮬레이션 (시간별 position, velocity 기록)
  const frames = simulateSpring(from, to, spring, initialVelocity);

  // 빈 프레임 처리
  if (frames.length === 0) {
    onStart?.();
    onComplete();
    return {
      stop: () => {},
      getPosition: () => to,
      getVelocity: () => 0,
      isRunning: () => false,
    };
  }

  // Phase 2: Keyframe 생성
  const keyframes = framesToKeyframes(frames, from, to, styleFn);
  const lastFrame = frames[frames.length - 1]!;
  const duration = lastFrame.time;

  // Phase 3: Web Animation API 실행
  const animation = element.animate(keyframes, {
    duration,
    fill: "forwards",
    easing: "linear", // spring 물리가 이미 keyframes에 적용됨
  });

  let isActive = true;
  const startTime = performance.now();

  onStart?.();

  animation.onfinish = () => {
    if (isActive) {
      isActive = false;
      onComplete();
    }
  };

  return {
    stop: () => {
      if (isActive) {
        isActive = false;
        animation.cancel();
      }
    },

    getPosition: () => {
      if (!isActive) {
        return lastFrame.position;
      }
      const elapsed = performance.now() - startTime;
      return interpolateFrame(frames, elapsed).position;
    },

    getVelocity: () => {
      if (!isActive) {
        return 0;
      }
      const elapsed = performance.now() - startTime;
      return interpolateFrame(frames, elapsed).velocity;
    },

    isRunning: () => isActive,
  };
}
