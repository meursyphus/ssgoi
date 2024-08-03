import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  '/demo/blog': {
    '/demo/post': transitions.scrollDownToUp,
    '/demo/image': transitions.ripple,
    '*': transitions.fade
  },
  '/demo/post': {
    '/demo/blog': transitions.scrollUpToDown,
    '/demo/image': transitions.ripple,
    '*': transitions.fade
  },
  '/demo/image': {
    '/': transitions.none,
    '/demo/blog': transitions.ripple,
    '/demo/post': transitions.ripple,
    '/demo/image/:color': transitions.none,
    '*': transitions.fade
  },
  '/demo/image/:color': {
    '/demo/image': transitions.none,
    '*': transitions.fade
  },
  '*': {
    '*': transitions.fade
  }
});

export default config;