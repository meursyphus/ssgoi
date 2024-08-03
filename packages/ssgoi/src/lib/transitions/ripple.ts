import type { Transition } from './type.js';
import { out } from './boilerflate/index.js';

function getOffset(node: Element) {
	const totalHeight = node.clientHeight;
	const visibleHeight = window.innerHeight - node.clientTop;
	const offset = (50 * visibleHeight) / totalHeight;

	return offset;
}

const ripple: Transition = ({ duration = 500, delay = 0, easing }: { duration?: number, delay?: number, easing?: (t: number) => number } = {}) => ({
	in(node) {
		const offset = getOffset(node);
		return {
			duration,
			delay,
			easing,
			css(t) {
				return `clip-path: circle(${t * 100}% at 50% ${offset}%);`;
			}
		};
	},
	out(node) {
		const offset = getOffset(node);
		return {
			duration,
			delay,
			easing,
			css(u) {
				return `${out} z-index: 100; clip-path: circle(${u * 100}% at 50% ${offset}%);`;
			}
		};
	}
});

export default ripple;
