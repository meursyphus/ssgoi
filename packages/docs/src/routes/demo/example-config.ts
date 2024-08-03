import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  '/': {
    '*': transitions.fade
  },
  '/blog': {
    '/post': transitions.scrollDownToUp,
    '/image': transitions.ripple,
    '*': transitions.fade
  },
  '/post': {
    '/blog': transitions.scrollUpToDown,
    '/image': transitions.ripple,
    '*': transitions.fade
  },
  '/image': {
    '/': transitions.none,
    '/blog': transitions.ripple,
    '/post': transitions.ripple,
    '/image/:color': transitions.none,
    '*': transitions.fade
  },
  '/image/:color': {
    '/image': transitions.none,
    '*': transitions.fade
  },
  '*': {
    '*': transitions.fade
  }
});

export default config;