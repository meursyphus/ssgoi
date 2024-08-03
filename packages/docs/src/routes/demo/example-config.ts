import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
  transitions: [
    // Specific routes take precedence
    {
      from: '/demo/blog',
      to: '/demo/post',
      transitions: transitions.scrollUpToDown
    },
    {
      from: '/demo/post',
      to: '/demo/blog',
      transitions: transitions.scrollDownToUp
    },
    {
      from: '/demo/blog',
      to: '/demo/image',
      transitions: transitions.ripple
    },
    {
      from: '/demo/post',
      to: '/demo/image',
      transitions: transitions.ripple
    },
    {
      from: '/demo/image',
      to: '/',
      transitions: transitions.none
    },
    {
      from: '/demo/image',
      to: '/demo/blog',
      transitions: transitions.fade
    },
    {
      from: '/demo/image',
      to: '/demo/post',
      transitions: transitions.fade
    },
    // More general rules
    {
      from: '/demo/image/*',
      to: '/demo/image',
      transitions: transitions.none
    },
    // Catch-all rules for /demo/image
    {
      from: '/demo/image',
      to: '*',
      transitions: transitions.fade
    },
    {
      from: '/demo/image/*',
      to: '*',
      transitions: transitions.fade
    }
  ],
  defaultTransition: transitions.fade
});

export default config;
