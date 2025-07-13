interface BounceOptions {
  height?: number;
  scale?: boolean;
  fade?: boolean;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
}

export const bounce = (options: BounceOptions = {}) => {
  const {
    height = 20,
    scale = true,
    fade = false,
    spring = { stiffness: 800, damping: 15 }
  } = options;

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const transforms = [];
        
        // Bounce effect using sine wave
        const bounceOffset = Math.sin(progress * Math.PI) * height * (1 - progress);
        transforms.push(`translateY(${-bounceOffset}px)`);
        
        if (scale) {
          transforms.push(`scale(${0.8 + progress * 0.2})`);
        }
        
        element.style.transform = transforms.join(' ');
        
        if (fade) {
          element.style.opacity = progress.toString();
        }
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const transforms = [];
        
        // Bounce effect using sine wave
        const bounceOffset = Math.sin(progress * Math.PI) * height * (1 - progress);
        transforms.push(`translateY(${-bounceOffset}px)`);
        
        if (scale) {
          transforms.push(`scale(${0.8 + progress * 0.2})`);
        }
        
        element.style.transform = transforms.join(' ');
        
        if (fade) {
          element.style.opacity = progress.toString();
        }
      }
    })
  };
};