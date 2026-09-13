import type {
  Integrator,
  IntegratorState,
} from "../animation/integrator/types";
import { SETTLE_THRESHOLD } from "../animation/integrator/types";
const FRAME_TIME = 1000 / 60;
export interface SimFrame {
  time: number;
  position: number;
  velocity: number;
  /** Optional driver-owned solver state; ordinary exported timelines stay compact. */
  state?: IntegratorState;
}

export function simulate(
  integrator: Integrator,
  from: number,
  to: number,
  initialVelocity: number,
  initialState?: IntegratorState,
  captureState = false,
): SimFrame[] {
  if (
    from === to &&
    initialVelocity === 0 &&
    (!initialState || integrator.isSettled(initialState, to))
  )
    return [];

  const MAX_FRAMES = 600;
  let state: IntegratorState = {
    ...initialState,
    position: from,
    velocity: initialVelocity,
  };
  let settleTime = 0;
  const frames: SimFrame[] = [];

  for (let i = 0; i < MAX_FRAMES; i++) {
    const time = i * FRAME_TIME;
    frames.push({
      time,
      position: state.position,
      velocity: state.velocity,
      ...(captureState ? { state } : {}),
    });

    state = integrator.step(state, to, FRAME_TIME / 1000);

    if (integrator.isSettled(state, to)) {
      settleTime += FRAME_TIME / 1000;
      if (settleTime >= SETTLE_THRESHOLD) {
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

export function interpolateFrame(
  frames: SimFrame[],
  elapsed: number,
): { position: number; velocity: number } {
  "worklet";
  if (frames.length === 0) return { position: 0, velocity: 0 };

  const first = frames[0]!;
  const last = frames[frames.length - 1]!;

  if (elapsed <= 0)
    return { position: first.position, velocity: first.velocity };
  if (elapsed >= last.time)
    return { position: last.position, velocity: last.velocity };

  let lo = 0;
  let hi = frames.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (frames[mid]!.time <= elapsed) lo = mid;
    else hi = mid;
  }
  const a = frames[lo]!;
  const b = frames[hi]!;
  const t = (elapsed - a.time) / (b.time - a.time);
  return {
    position: a.position + (b.position - a.position) * t,
    velocity: a.velocity + (b.velocity - a.velocity) * t,
  };
}

/** Read a compatible solver's hidden state as well as its visible output. */
export function sampleIntegratorState(
  frames: SimFrame[],
  elapsed: number,
  integrator: Integrator,
  target: number,
): IntegratorState {
  const visible = interpolateFrame(frames, elapsed);
  let frame = frames[0];
  for (const candidate of frames) {
    if (candidate.time > elapsed) break;
    frame = candidate;
  }
  if (!frame?.state) return visible;
  const remainder =
    Math.max(0, Math.min(1000 / 60, elapsed - frame.time)) / 1000;
  const state = remainder
    ? integrator.step(frame.state, target, remainder)
    : frame.state;
  return { ...state, ...visible };
}
