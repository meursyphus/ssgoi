import * as transitions from '@ssgoi/angular/transitions';

type TransitionType = keyof typeof transitions;

export const transitionDemos: {
  id: TransitionType;
  name: string;
  description: string;
}[] = [
  {
    id: 'fade',
    name: 'Fade',
    description: 'Smooth opacity transition for elements',
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'Scale elements in and out with various options',
  },
  {
    id: 'blur',
    name: 'Blur',
    description: 'Blur effect combined with fade',
  },
  {
    id: 'slide',
    name: 'Slide',
    description: 'Slide elements from any direction',
  },
  {
    id: 'fly',
    name: 'Fly',
    description: 'Fly in from custom x/y coordinates',
  },
  {
    id: 'rotate',
    name: 'Rotate',
    description: 'Rotate elements with 2D/3D axes',
  },
  {
    id: 'bounce',
    name: 'Bounce',
    description: 'Bouncing animation with customizable parameters',
  },
  {
    id: 'mask',
    name: 'Mask',
    description: 'Reveal elements using mask shapes',
  },
];
