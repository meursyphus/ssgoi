interface NoneOptions {
  spring?: {
    stiffness?: number;
    damping?: number;
  };
}

export const none = (options: NoneOptions = {}) => {
  const {
    spring = { stiffness: 1000, damping: 100 }
  } = options;

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        // No animation, just instantly show
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        // No animation, just instantly hide
      }
    })
  };
};