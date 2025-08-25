import type { TransitionKey } from '../types';

interface RotateOptions {
  degrees?: number;
  clockwise?: boolean;
  scale?: boolean;
  fade?: boolean;
  origin?: string;
  axis?: '2d' | 'x' | 'y' | 'z';
  perspective?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const rotate = (options: RotateOptions = {}) => {
  const {
    degrees = 360,
    clockwise = true,
    scale = false,
    fade = true,
    origin = 'center',
    axis = '2d',
    perspective = 800,
    spring = { stiffness: 500, damping: 25 },
    key
  } = options;

  const rotation = clockwise ? degrees : -degrees;

  const getRotateTransform = (progress: number): string => {
    const angle = (1 - progress) * rotation;
    switch (axis) {
      case 'x':
        return `perspective(${perspective}px) rotateX(${angle}deg)`;
      case 'y':
        return `perspective(${perspective}px) rotateY(${angle}deg)`;
      case 'z':
        return `rotateZ(${angle}deg)`;
      case '2d':
      default:
        return `rotate(${angle}deg)`;
    }
  };

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const transforms = [getRotateTransform(progress)];
        
        if (scale) {
          transforms.push(`scale(${progress})`);
        }
        
        element.style.transform = transforms.join(' ');
        element.style.transformOrigin = origin;
        
        if (fade) {
          element.style.opacity = progress.toString();
        }
      }
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const transforms = [getRotateTransform(progress)];
        
        if (scale) {
          transforms.push(`scale(${progress})`);
        }
        
        element.style.transform = transforms.join(' ');
        element.style.transformOrigin = origin;
        
        if (fade) {
          element.style.opacity = progress.toString();
        }
      }
    }),
    ...(key && { key })
  };
};