interface RotateOptions {
  degrees?: number;
  clockwise?: boolean;
  scale?: boolean;
  fade?: boolean;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
}

export const rotate = (options: RotateOptions = {}) => {
  const {
    degrees = 360,
    clockwise = true,
    scale = false,
    fade = false,
    spring = { stiffness: 500, damping: 25 }
  } = options;

  const rotation = clockwise ? degrees : -degrees;

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const transforms = [`rotate(${progress * rotation}deg)`];
        
        if (scale) {
          transforms.push(`scale(${progress})`);
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
        const transforms = [`rotate(${progress * rotation}deg)`];
        
        if (scale) {
          transforms.push(`scale(${progress})`);
        }
        
        element.style.transform = transforms.join(' ');
        
        if (fade) {
          element.style.opacity = progress.toString();
        }
      }
    })
  };
};