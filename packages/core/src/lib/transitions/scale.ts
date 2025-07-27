interface ScaleOptions {
  start?: number;
  opacity?: number;
  axis?: 'x' | 'y' | 'both';
  spring?: {
    stiffness?: number;
    damping?: number;
  };
}

export const scale = (options: ScaleOptions = {}) => {
  const {
    start = 0,
    opacity = 0,
    axis = 'both',
    spring = { stiffness: 300, damping: 30 }
  } = options;

  const getScaleTransform = (value: number): string => {
    switch (axis) {
      case 'x':
        return `scaleX(${value})`;
      case 'y':
        return `scaleY(${value})`;
      case 'both':
      default:
        return `scale(${value})`;
    }
  };

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const scaleValue = start + (1 - start) * progress;
        element.style.transform = getScaleTransform(scaleValue);
        element.style.opacity = (opacity + (1 - opacity) * progress).toString();
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const scaleValue = start + (1 - start) * progress;
        element.style.transform = getScaleTransform(scaleValue);
        element.style.opacity = (opacity + (1 - opacity) * progress).toString();
      }
    })
  };
};