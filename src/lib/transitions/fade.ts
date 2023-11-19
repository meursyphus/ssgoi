import type { Transition } from './type.js';
import { out } from './boilerflate/index.js';

const fade: Transition = {
	in(node, { duration = 300 }) {
		return {
			duration,
			css(t) {
				return `opacity: ${t};`;
			}
		};
	},
	out(node, { duration = 300 }) {
		return {
			duration,
			css(t) {
				return `${out}; opacity: ${t}`;
			}
		};
	}
};

export default fade;
