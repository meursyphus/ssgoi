import { scrollDownToUp, scrollUpToDown, fade, ripple, none } from '$lib/transitions/index.js';
import { createTransitionConfig } from '$lib/createTranstionConfig.js';

const config = createTransitionConfig({
  '/': {
    '*': fade
  },
  '/blog': {
    '/post': scrollDownToUp,
    '/image': ripple,
    '*': fade
  },
  '/post': {
    '/blog': scrollUpToDown,
    '/image': ripple,
    '*': fade
  },
  '/image': {
    '/': none,
    '/blog': ripple,
    '/post': ripple,
    '/image/:color': none,
    '*': none
  },
  '/image/:color': {
    '/image': none,
    '*': fade
  },
  '*': {
    '*': fade
  }
});

export default config;