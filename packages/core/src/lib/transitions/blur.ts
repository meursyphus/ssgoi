interface BlurOptions {
  amount?: number;
  scale?: boolean;
  fade?: boolean;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
}

export const blur = (options: BlurOptions = {}) => {
  const {
    amount = 10,
    scale = false,
    fade = true,
    spring = { stiffness: 300, damping: 30 }
  } = options;

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const blurValue = (1 - progress) * amount;
        const filters = [`blur(${blurValue}px)`];
        
        element.style.filter = filters.join(' ');
        
        if (scale) {
          element.style.transform = `scale(${0.8 + progress * 0.2})`;
        }
        
        if (fade) {
          element.style.opacity = progress.toString();
        }
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const blurValue = (1 - progress) * amount;
        const filters = [`blur(${blurValue}px)`];
        
        element.style.filter = filters.join(' ');
        
        if (scale) {
          element.style.transform = `scale(${0.8 + progress * 0.2})`;
        }
        
        if (fade) {
          element.style.opacity = progress.toString();
        }
      }
    })
  };
};