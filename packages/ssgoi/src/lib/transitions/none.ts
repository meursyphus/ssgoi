import type { Transition } from './type.js';
import { out } from './boilerflate/index.js';

const none: Transition = {
	in() {
		return {
			duration: 0,
			css() {
				return ``;
			}
		};
	},
	out() {
		return {
			duration: 0,
			css() {
				return `${out} opacity: 0;`;
			}
		};
	}
};

export default none;
