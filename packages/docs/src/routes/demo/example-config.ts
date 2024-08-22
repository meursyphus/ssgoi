import { createTransitionConfig, transitions } from 'ssgoi';
import { pinterestToDetail, pinterestToGallery } from './temp';
import { none } from '../../../../ssgoi/dist/transitions';

const config = createTransitionConfig({
  transitions: [
    {
      from: '/demo/pinterest/*',
      to: '/demo/pinterest',
      transitions: pinterestToGallery()
    },
    {
      from: '/demo/pinterest',
      to: '/demo/pinterest/*',
      transitions: pinterestToDetail()
    },
    {
      from: '/demo/blog',
      to: '/demo/image',
      transitions: {
        in: transitions.ripple().in,
        out: transitions.fade().out
      }
    },
    {
      from: '/demo/image',
      to: '/demo/blog',
      transitions: {
        in: transitions.none().in,
        out: transitions.ripple().out
      }
    },
    {
      from: '/demo/blog',
      to: '/demo/post',
      transitions: transitions.scrollDownToUp()
    },
    {
      from: '/demo/post',
      to: '/demo/blog',
      transitions: transitions.scrollUpToDown()
    },
    {
      from: '/demo/blog',
      to: '/demo/image',
      transitions: transitions.ripple()
    },
    {
      from: '/demo/post',
      to: '/demo/image',
      transitions: {
        in: transitions.ripple().in,
        out: transitions.fade().out
      }
    },
    {
      from: '/demo/image',
      to: '/demo/post',
      transitions: {
        in: transitions.none().in,
        out: transitions.ripple().out
      }
    },
    {
      from: '/demo/image',
      to: '/',
      transitions: transitions.none()
    },
    {
      from: '/demo/image',
      to: '/demo/blog',
      transitions: transitions.ripple()
    },
    // More general rules
    {
      to: '/demo/image/*',
      from: '/demo/image',
      transitions: transitions.none(),
    },
    {
      from: '/demo/image/*',
      to: '/demo/image',
      transitions: transitions.none(),
    },
    // Catch-all rules for /demo/image
    {
      from: '/demo/image',
      to: '*',
      transitions: transitions.fade()
    },
    {
      from: '/demo/image/*',
      to: '*',
      transitions: transitions.fade()
    }
  ],
  defaultTransition: transitions.fade()
});

export default config;