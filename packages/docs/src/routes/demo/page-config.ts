import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
	transitions: [
		{
			from: '/demo/pinterest/*',
			to: '/demo/pinterest',
			transitions: transitions.pinterest.exit()
		},
		{
			from: '/demo/pinterest',
			to: '/demo/pinterest/*',
			transitions: transitions.pinterest.enter()
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
			to: '/demo/post/*',
			transitions: {
				in: transitions.none().in,
				out: transitions.ripple().out
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
			transitions: transitions.hero()
		},
		{
			from: '/demo/image/*',
			to: '/demo/image',
			transitions: transitions.hero()
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
		},
		// blog
		{
			from: '/demo/blog',
			to: '/demo/blog/fade',
			transitions: {
				in: transitions.fade({
					duration: 300
				}).in,
				out: transitions.none().out
			}
		},
		{
			from: '/demo/blog/fade',
			to: '/demo/blog',
			transitions: {
				in: transitions.fade({
					duration: 300
				}).in,
				out: transitions.none().out
			}
		},
		{
			from: '/demo/blog',
			to: '/demo/blog/scroll',
			transitions: transitions.scrollUpToDown()
		},
		{
			from: '/demo/blog/scroll',
			to: '/demo/blog',
			transitions: transitions.scrollDownToUp()
		},
		{
			from: '/demo/blog',
			to: '/demo/blog/ripple',
			transitions: {
				in: transitions.ripple().in,
				out: transitions.fade().out
			}
		},
		{
			from: '/demo/blog/ripple',
			to: '/demo/blog',
			transitions: {
				in: transitions.ripple().in,
				out: transitions.fade().out
			}
		},
		{
			from: '/demo/blog',
			to: '/demo/blog/pinterest',
			transitions: transitions.pinterest.enter()
		},
		{
			from: '/demo/blog/pinterest',
			to: '/demo/blog',
			transitions: transitions.pinterest.exit()
		},
		{
			from: '/demo/blog',
			to: '/demo/blog/hero',
			transitions: transitions.hero()
		},
		{
			from: '/demo/blog/hero',
			to: '/demo/blog',
			transitions: transitions.hero()
		}
	],
	defaultTransition: transitions.fade()
});

export default config;
