import type { Transition } from './type.js';
import { out } from './boilerflate/index.js';

function getOffset(node: Element) {
	const totalHeight = node.clientHeight;
	const visibleHeight = window.innerHeight - node.clientTop;
	const offset = (50 * visibleHeight) / totalHeight;

	return offset;
}

const ripple: Transition = {
	in(node, { duration = 500 }) {
		const offset = getOffset(node);
		return {
			duration,
			css(t) {
				return `clip-path: circle(${t * 100}% at 50% ${offset}%);`;
			}
		};
	},
	out(node, { duration = 500 }) {
		const offset = getOffset(node);
		return {
			duration,
			css(u) {
				return `${out} z-index: 1; clip-path: circle(${u * 100}% at 50% ${offset}%);`;
			}
		};
	}
};

export default ripple;
