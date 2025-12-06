/**
 * Spring Core
 *
 * Spring 물리 계산의 핵심 로직을 담은 모듈
 * animate.ts (RAF 기반)와 css-keyframe-generator.ts (동기 시뮬레이션) 모두에서 사용
 *
 * 최적화된 Semi-implicit Euler 방식 사용 (Allen Chou's approach)
 */

export interface SpringConfig {
  stiffness: number;
  damping: number;
}

export interface SpringState {
  position: number;
  velocity: number;
}

export interface SpringConstants {
  omega: number; // Angular frequency
  zeta: number; // Damping ratio
}

/**
 * Spring 상수 미리 계산 (성능 최적화)
 *
 * @param config Spring 설정
 * @returns omega (각진동수), zeta (감쇠비)
 */
export function computeSpringConstants(config: SpringConfig): SpringConstants {
  const stiffness = config.stiffness;
  const damping = config.damping;
  const mass = 1;
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  return { omega, zeta };
}

/**
 * Spring 한 스텝 계산 (Semi-implicit Euler)
 *
 * 기존 F = -k(x-xt) - d*v 대신
 * omega와 zeta를 사용한 최적화된 공식 사용:
 * - v += -2*h*zeta*omega*v + h*omega^2*(target - x)
 * - x += h*v
 *
 * @param state 현재 상태 (position, velocity)
 * @param target 목표 위치
 * @param constants 미리 계산된 spring 상수 (omega, zeta)
 * @param dt delta time (seconds)
 * @returns 새로운 상태
 */
export function stepSpring(
  state: SpringState,
  target: number,
  constants: SpringConstants,
  dt: number,
): SpringState {
  const { omega, zeta } = constants;
  const { position, velocity } = state;

  // Clamp dt for stability (max 33ms for 30fps minimum)
  const h = Math.min(dt, 0.033);

  // Semi-implicit Euler (Allen Chou's formulation)
  const dampingForce = -2.0 * h * zeta * omega * velocity;
  const springForce = h * omega * omega * (target - position);
  const newVelocity = velocity + dampingForce + springForce;
  const newPosition = position + h * newVelocity;

  return {
    position: newPosition,
    velocity: newVelocity,
  };
}

// Convergence thresholds
export const POSITION_THRESHOLD = 0.01;
export const VELOCITY_THRESHOLD = 0.01;
export const SETTLE_THRESHOLD = 0.05; // 50ms of settling

/**
 * Spring이 목표에 수렴했는지 확인
 */
export function isSettled(state: SpringState, target: number): boolean {
  const displacement = Math.abs(target - state.position);
  const speed = Math.abs(state.velocity);
  return displacement < POSITION_THRESHOLD && speed < VELOCITY_THRESHOLD;
}

/**
 * Spring 전체 시뮬레이션 (동기적)
 * Web Animation API용 keyframe 생성에 사용
 *
 * @param config Spring 설정
 * @param from 시작값
 * @param to 목표값
 * @param initialVelocity 초기 속도
 * @returns 프레임별 progress 배열과 duration
 */
export function simulateSpring(
  config: SpringConfig,
  from: number,
  to: number,
  initialVelocity = 0,
): { frames: number[]; duration: number } {
  const constants = computeSpringConstants(config);
  const FRAME_TIME = 1 / 60; // 60fps (seconds)
  const MAX_FRAMES = 600; // 최대 10초

  let state: SpringState = { position: from, velocity: initialVelocity };
  let settleTime = 0;
  const range = to - from;
  const frames: number[] = [];

  for (let i = 0; i < MAX_FRAMES; i++) {
    // Progress 계산 (0~1)
    const progress = range !== 0 ? (state.position - from) / range : 1;
    frames.push(Math.max(0, Math.min(1, progress)));

    // Spring 스텝
    state = stepSpring(state, to, constants, FRAME_TIME);

    // 수렴 체크
    if (isSettled(state, to)) {
      settleTime += FRAME_TIME;
      if (settleTime >= SETTLE_THRESHOLD) {
        // 마지막 프레임은 정확히 목표값
        const finalProgress = range !== 0 ? 1 : 1;
        frames.push(finalProgress);
        break;
      }
    } else {
      settleTime = 0;
    }
  }

  return {
    frames,
    duration: frames.length * (1000 / 60), // ms
  };
}
