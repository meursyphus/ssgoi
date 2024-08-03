import type { Transition } from './type.js';
import { out } from './boilerflate/index.js';

const fade: Transition = {
	in(node) {
		return {
			duration: 300,
			css(t) {
				return `opacity: ${t};`;
			}
		};
	},
	out(node) {
		return {
			duration: 300,
			css(t) {
				return `${out}; opacity: ${t}`;
			}
		};
	}
};

export default fade;
