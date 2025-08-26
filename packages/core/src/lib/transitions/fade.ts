import type { TransitionKey } from '../types';

interface FadeOptions {
  from?: number;
  to?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const fade = (options: FadeOptions = {}) => {
  const {
    from = 0,
    to = 1,
    spring = { stiffness: 300, damping: 30 },
    key
  } = options;

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const opacity = from + (to - from) * progress;
        element.style.opacity = opacity.toString();
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const opacity = from + (to - from) * progress;
        element.style.opacity = opacity.toString();
      }
    }),
    ...(key && { key })
  };
};