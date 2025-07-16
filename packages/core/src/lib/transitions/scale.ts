interface ScaleOptions {
  duration?: number;
  from?: number;
  to?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
}

export const scale = (options: ScaleOptions = {}) => {
  const {
    from = 0,
    to = 1,
    spring = { stiffness: 300, damping: 30 }
  } = options;

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const value = from + (to - from) * progress;
        element.style.transform = `scale(${value})`;
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const value = from + (to - from) * progress;
        element.style.transform = `scale(${value})`;
      }
    })
  };
};