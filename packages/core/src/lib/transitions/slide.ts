interface SlideOptions {
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number | string;
  opacity?: number;
  fade?: boolean;
  axis?: 'x' | 'y';
  spring?: {
    stiffness?: number;
    damping?: number;
  };
}

export const slide = (options: SlideOptions = {}) => {
  const {
    direction,
    distance = 100,
    opacity = 0,
    fade = true,
    axis,
    spring = { stiffness: 400, damping: 35 }
  } = options;

  // Determine actual direction based on axis parameter
  const getActualDirection = (): 'left' | 'right' | 'up' | 'down' => {
    if (direction) return direction;
    if (axis === 'x') return 'left';
    if (axis === 'y') return 'up';
    return 'left';
  };

  const actualDirection = getActualDirection();

  const getDistance = (value: number | string): string => {
    return typeof value === 'number' ? `${value}px` : value;
  };

  const getTransform = (progress: number) => {
    const multiplier = 1 - progress;
    const offset = typeof distance === 'number' 
      ? multiplier * distance 
      : `calc(${getDistance(distance)} * ${multiplier})`;
    
    switch (actualDirection) {
      case 'left':
        return typeof distance === 'number'
          ? `translateX(${-offset}px)`
          : `translateX(calc(-1 * ${offset}))`;
      case 'right':
        return typeof distance === 'number'
          ? `translateX(${offset}px)`
          : `translateX(${offset})`;
      case 'up':
        return typeof distance === 'number'
          ? `translateY(${-offset}px)`
          : `translateY(calc(-1 * ${offset}))`;
      case 'down':
        return typeof distance === 'number'
          ? `translateY(${offset}px)`
          : `translateY(${offset})`;
    }
  };

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        element.style.transform = getTransform(progress);
        if (fade) {
          element.style.opacity = (opacity + (1 - opacity) * progress).toString();
        }
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        element.style.transform = getTransform(progress);
        if (fade) {
          element.style.opacity = (opacity + (1 - opacity) * progress).toString();
        }
      }
    })
  };
};