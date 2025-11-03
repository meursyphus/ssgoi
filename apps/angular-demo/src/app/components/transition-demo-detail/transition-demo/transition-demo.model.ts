import * as transitions from '@ssgoi/angular/transitions';
import { config as springPresets } from '@ssgoi/angular/presets';

export type TransitionType = keyof typeof transitions;
export type SpringPreset = keyof typeof springPresets;

export interface OptionConfig {
  name: string;
  type: 'range' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  default: number | string | boolean;
  options?: string[];
}

export const transitionOptions: Partial<
  Record<TransitionType, OptionConfig[]>
> = {
  scale: [
    { name: 'start', type: 'range', min: 0, max: 2, step: 0.1, default: 0 },
    { name: 'opacity', type: 'range', min: 0, max: 1, step: 0.1, default: 0 },
    {
      name: 'axis',
      type: 'select',
      options: ['both', 'x', 'y'],
      default: 'both',
    },
  ],
  fade: [
    { name: 'from', type: 'range', min: 0, max: 1, step: 0.1, default: 0 },
    { name: 'to', type: 'range', min: 0, max: 1, step: 0.1, default: 1 },
  ],
  rotate: [
    {
      name: 'degrees',
      type: 'range',
      min: 0,
      max: 720,
      step: 45,
      default: 360,
    },
    { name: 'clockwise', type: 'toggle', default: true },
    { name: 'scale', type: 'toggle', default: false },
    { name: 'fade', type: 'toggle', default: true },
    {
      name: 'axis',
      type: 'select',
      options: ['2d', 'x', 'y', 'z'],
      default: '2d',
    },
    {
      name: 'perspective',
      type: 'range',
      min: 100,
      max: 2000,
      step: 100,
      default: 800,
    },
    {
      name: 'origin',
      type: 'select',
      options: [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top left',
        'top right',
        'bottom left',
        'bottom right',
      ],
      default: 'center',
    },
  ],
  slide: [
    {
      name: 'direction',
      type: 'select',
      options: ['left', 'right', 'up', 'down'],
      default: 'left',
    },
    {
      name: 'distance',
      type: 'range',
      min: 0,
      max: 500,
      step: 10,
      default: 100,
    },
    { name: 'opacity', type: 'range', min: 0, max: 1, step: 0.1, default: 0 },
    { name: 'fade', type: 'toggle', default: true },
  ],
  bounce: [
    { name: 'height', type: 'range', min: 0, max: 100, step: 5, default: 20 },
    { name: 'bounces', type: 'range', min: 1, max: 10, step: 1, default: 3 },
    { name: 'fade', type: 'toggle', default: true },
  ],
  blur: [
    { name: 'amount', type: 'range', min: 0, max: 20, step: 1, default: 10 },
    { name: 'opacity', type: 'range', min: 0, max: 1, step: 0.1, default: 0 },
  ],
  fly: [
    { name: 'y', type: 'range', min: -500, max: 500, step: 10, default: -100 },
    { name: 'x', type: 'range', min: -500, max: 500, step: 10, default: 0 },
    { name: 'opacity', type: 'range', min: 0, max: 1, step: 0.1, default: 0 },
  ],
  mask: [
    {
      name: 'shape',
      type: 'select',
      options: ['circle', 'ellipse', 'square'],
      default: 'circle',
    },
    {
      name: 'origin',
      type: 'select',
      options: [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      default: 'center',
    },
    { name: 'scale', type: 'range', min: 0.5, max: 3, step: 0.1, default: 1.5 },
    { name: 'fade', type: 'toggle', default: false },
  ],
};
