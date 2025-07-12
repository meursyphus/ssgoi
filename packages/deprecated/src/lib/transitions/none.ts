import { out } from './boilerplate/index.js';
import type { Transition } from '$lib/types.js'

const none: Transition = ({
	duration = 0,
	delay = 0,
	easing
}: { duration?: number; delay?: number; easing?: (t: number) => number } = {}) => ({
	in() {
		return {
			duration,
			delay,
			easing,
			css() {
				return ``;
			}
		};
	},
	out(node) {
		return {
			duration,
			delay,
			easing,
			css() {
				return `${out} opacity: 0;`;
			}
		};
	}
});

export default none;
