import { createTransitionConfig, transitions } from 'ssgoi';

const config = createTransitionConfig({
	transitions: [
		// Pinterest transitions - enter/exit with pinterest animation
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

		// Products transitions - hero
		{
			from: '/demo/products',
			to: '/demo/products/*',
			transitions: transitions.hero()
		},
		{
			from: '/demo/products/*',
			to: '/demo/products',
			transitions: transitions.hero()
		},

		// Post detail transitions - slide with parallax effect
		{
			from: '/demo/post',
			to: '/demo/post/*',
			transitions: {
				in: (node) => ({
					duration: 400,
					css: (t) => `transform: translateX(${(1 - t) * 100}%);`
				}),
				out: (node) => ({
					duration: 400,
					css: (u, t) =>
						`position: absolute; left: 0; top: 0; width: 100%; transform: translateX(${-t * 20}%);`
				})
			}
		},
		{
			from: '/demo/post/*',
			to: '/demo/post',
			transitions: {
				in: (node) => ({
					duration: 400,
					css: (t, u) => `transform: translateX(${-u * 20}%);`
				}),
				out: (node) => ({
					duration: 400,
					css: (u, t) =>
						`z-index: 100; position: absolute; left: 0; top: 0; width: auto; transform: translateX(${t * 100}%);`
				})
			}
		},

		{
			from: '/demo/*',
			to: '/demo/profile',
			transitions: {
				in: transitions.ripple().in,
				out: transitions.none().out
			}
		},
		{
			from: '/demo/profile',
			to: '/demo/*',
			transitions: {
				in: transitions.none().in,
				out: transitions.ripple().out
			}
		}
	],
	defaultTransition: transitions.none()
});

export default config;
