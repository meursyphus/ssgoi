import { out } from './boilerplate/index.js';
import type { Transition } from '$lib/types.js'

const fade: Transition = ({
	duration,
	delay,
	easing
}: { duration?: number; delay?: number; easing?: (t: number) => number } = {}) => ({
	in(node) {
		return {
			duration,
			delay,
			easing,
			css(t) {
				return `opacity: ${t};`;
			}
		};
	},
	out(node) {
		return {
			duration,
			delay,
			easing,
			css(t) {
				return `${out}; opacity: ${t}`;
			}
		};
	}
});

export default fade;
