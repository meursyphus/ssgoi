import type { SsgoiConfig } from '@ssgoi/svelte';

export const transitionConfig: SsgoiConfig = {
  transitions: {
    hero: {
      duration: 600,
      easing: 'ease-in-out'
    },
    fade: {
      duration: 300,
      easing: 'ease-out'
    }
  }
};