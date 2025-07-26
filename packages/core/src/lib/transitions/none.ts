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
    in: (_element: HTMLElement) => ({
      spring,
      tick: (_progress: number) => {
        // No animation, just instantly show
      }
    }),
    out: (_element: HTMLElement) => ({
      spring,
      tick: (_progress: number) => {
        // No animation, just instantly hide
      }
    })
  };
};