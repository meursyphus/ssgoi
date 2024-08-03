import type { Transition } from './type.js';
import { out } from './boilerflate/index.js';

const none: Transition = ({ duration = 0, delay = 0, easing }: { duration?: number, delay?: number, easing?: (t: number) => number } = {}) => ({
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
	out() {
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