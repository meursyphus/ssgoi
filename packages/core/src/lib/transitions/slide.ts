interface SlideOptions {
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  fade?: boolean;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
}

export const slide = (options: SlideOptions = {}) => {
  const {
    direction = 'left',
    distance = 100,
    fade = true,
    spring = { stiffness: 400, damping: 35 }
  } = options;

  const getTransform = (progress: number) => {
    const offset = (1 - progress) * distance;
    switch (direction) {
      case 'left':
        return `translateX(${-offset}px)`;
      case 'right':
        return `translateX(${offset}px)`;
      case 'up':
        return `translateY(${-offset}px)`;
      case 'down':
        return `translateY(${offset}px)`;
    }
  };

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        element.style.transform = getTransform(progress);
        if (fade) {
          element.style.opacity = progress.toString();
        }
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        element.style.transform = getTransform(progress);
        if (fade) {
          element.style.opacity = progress.toString();
        }
      }
    })
  };
};