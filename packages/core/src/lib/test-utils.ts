import { vi } from "vitest";
import type { SpringConfig, SpringItem } from "./types";
import { Animator } from "../animator";

/**
 * Mock timer utilities for testing animations
 */
export const mockTimers = {
  setup: () => {
    vi.useFakeTimers();
  },
  cleanup: () => {
    vi.clearAllTimers();
    vi.useRealTimers();
  },
  advance: (ms: number) => {
    vi.advanceTimersByTime(ms);
  },
  runAll: () => {
    vi.runAllTimers();
  },
};

/**
 * Create a mock spring item for testing
 */
export function createMockSpringItem(
  overrides: Partial<SpringItem> = {},
): SpringItem {
  return {
    from: 0,
    to: 1,
    spring: { stiffness: 300, damping: 30 },
    tick: vi.fn(),
    onStart: vi.fn(),
    onComplete: vi.fn(),
    offset: 0,
    ...overrides,
  };
}

/**
 * Create a mock spring config
 */
export function createMockSpringConfig(
  overrides: Partial<SpringConfig> = {},
): SpringConfig {
  return {
    stiffness: 300,
    damping: 30,
    ...overrides,
  };
}

/**
 * Wait for all animators to complete
 * Uses real timers and RAF polling
 */
export async function waitForAnimation(timeout = 5000): Promise<void> {
  return new Promise((_resolve, reject) => {
    const start = Date.now();
    const checkComplete = () => {
      if (Date.now() - start > timeout) {
        reject(new Error("Animation timeout"));
        return;
      }
      // Check if all animations are done (naive approach)
      // In real tests, we'll use completion callbacks
      requestAnimationFrame(checkComplete);
    };
    checkComplete();
  });
}

/**
 * Spy on console methods
 */
export const consoleSpy = {
  warn: () => vi.spyOn(console, "warn").mockImplementation(() => {}),
  error: () => vi.spyOn(console, "error").mockImplementation(() => {}),
  log: () => vi.spyOn(console, "log").mockImplementation(() => {}),
};

/**
 * Mock Animator for testing without real animation
 */
export function createMockAnimator() {
  const animator = {
    forward: vi.fn(),
    backward: vi.fn(),
    stop: vi.fn(),
    reverse: vi.fn(),
    getCurrentState: vi.fn(() => ({
      position: 0,
      velocity: 0,
      from: 0,
      to: 1,
    })),
  };
  return animator as unknown as Animator;
}
