interface FlyOptions {
  x?: number | string;
  y?: number | string;
  opacity?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
}

export const fly = (options: FlyOptions = {}) => {
  const {
    x = 0,
    y = -100,
    opacity = 0,
    spring = { stiffness: 400, damping: 35 }
  } = options;

  const getX = (value: number | string): string => {
    return typeof value === 'number' ? `${value}px` : value;
  };

  const getY = (value: number | string): string => {
    return typeof value === 'number' ? `${value}px` : value;
  };

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const xOffset = typeof x === 'number' ? (1 - progress) * x : `calc(${getX(x)} * ${1 - progress})`;
        const yOffset = typeof y === 'number' ? (1 - progress) * y : `calc(${getY(y)} * ${1 - progress})`;
        
        element.style.transform = `translate(${typeof x === 'number' ? xOffset + 'px' : xOffset}, ${typeof y === 'number' ? yOffset + 'px' : yOffset})`;
        element.style.opacity = (opacity + (1 - opacity) * progress).toString();
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const xOffset = typeof x === 'number' ? (1 - progress) * x : `calc(${getX(x)} * ${1 - progress})`;
        const yOffset = typeof y === 'number' ? (1 - progress) * y : `calc(${getY(y)} * ${1 - progress})`;
        
        element.style.transform = `translate(${typeof x === 'number' ? xOffset + 'px' : xOffset}, ${typeof y === 'number' ? yOffset + 'px' : yOffset})`;
        element.style.opacity = (opacity + (1 - opacity) * progress).toString();
      }
    })
  };
};