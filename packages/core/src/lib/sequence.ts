import type { SequenceConfig, TransitionOptions } from "./types";

/**
 * Add sequence configuration to any transition
 */
export function withSequence<TAnimationValue = number>(
  transitionOptions: TransitionOptions<undefined, TAnimationValue>,
  sequenceConfig: SequenceConfig,
): TransitionOptions<undefined, TAnimationValue> & {
  sequence: SequenceConfig;
} {
  return {
    ...transitionOptions,
    sequence: sequenceConfig,
  };
}

/**
 * Create common sequence configurations
 */
export const sequence = {
  /**
   * Basic sequence with default 50ms delay
   */
  basic: (delay: number = 50): SequenceConfig => ({
    delay,
    direction: "normal",
  }),

  /**
   * Reverse sequence (animate from last to first)
   */
  reverse: (delay: number = 50): SequenceConfig => ({
    delay,
    direction: "reverse",
  }),

  /**
   * Custom sequence with delay function
   */
  custom: (
    delayFn: (index: number, total: number) => number,
  ): SequenceConfig => ({
    delayFn,
  }),

  /**
   * Exponential sequence (delays increase exponentially)
   */
  exponential: (
    baseDelay: number = 50,
    multiplier: number = 1.5,
  ): SequenceConfig => ({
    delayFn: (index: number) => baseDelay * Math.pow(multiplier, index),
  }),

  /**
   * Wave sequence (delays form a wave pattern)
   */
  wave: (baseDelay: number = 50, amplitude: number = 30): SequenceConfig => ({
    delayFn: (index: number, total: number) => {
      const wave = Math.sin((index / total) * Math.PI) * amplitude;
      return baseDelay + wave;
    },
  }),
};
