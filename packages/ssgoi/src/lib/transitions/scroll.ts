import { out } from './boilerplate/index.js';
import type { Transition } from './type.js';

const DEFAULT_VELOCITY = 1.2;

const scroll = ({
	velocity = DEFAULT_VELOCITY,
	delay = 0,
	easing,
	reverse
}: {
	velocity?: number;
	delay?: number;
	easing?: (t: number) => number;
	reverse?: boolean;
} = {}) => ({
	in(node: Element) {
		const height = window.innerHeight - node.clientTop;
		const duration = height / velocity;

		return {
			duration,
			delay,
			easing,
			css(_: number, u: number) {
				return `transform: translateY(${(reverse ? 1 : -1) * u * height}px)`;
			}
		};
	},
	out(node: Element) {
		const height = window.innerHeight - node.clientTop;
		const duration = height / velocity;
		return {
			duration,
			delay,
			easing,
			css(_: number, t: number) {
				return `${out} z-index: ${reverse ? -1 : 1}; transform: translateY(${
					(reverse ? -1 : 1) * t * height
				}px);`;
			}
		};
	}
});

export const scrollUpToDown: Transition = ({
	velocity,
	delay,
	easing
}: { velocity?: number; delay?: number; easing?: (t: number) => number } = {}) => ({
	in(node) {
		return scroll({ reverse: false, velocity, delay, easing }).in(node);
	},
	out(node) {
		return scroll({ reverse: false, velocity, delay, easing }).out(node);
	}
});

export const scrollDownToUp: Transition = ({
	velocity,
	delay,
	easing
}: { velocity?: number; delay?: number; easing?: (t: number) => number } = {}) => ({
	in(node) {
		return scroll({ reverse: true, velocity, delay, easing }).in(node);
	},
	out(node) {
		return scroll({ reverse: true, velocity, delay, easing }).out(node);
	}
});
