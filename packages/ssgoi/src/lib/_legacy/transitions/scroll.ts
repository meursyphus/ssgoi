import type { Transition } from './type.js';
import { out } from './boilerflate/index.js';

const VELOCITY = 1.2;

const scroll = {
	in(node, { reverse = false }: { duration?: number; reverse?: boolean }) {
		const height = window.innerHeight - node.clientTop;
		const duration = height / VELOCITY;

		return {
			duration,
			css(_, u) {
				return `transform: translateY(${(reverse ? 1 : -1) * u * height}px)`;
			}
		};
	},
	out(node, { reverse = false }: { duration?: number; reverse?: boolean }) {
		const height = window.innerHeight - node.clientTop;
		const duration = height / VELOCITY;
		return {
			duration,
			css(_, t) {
				return `${out} z-index: ${reverse ? 1 : -1}; transform: translateY(${
					(reverse ? 1 : -1) * t * height
				}px);`;
			}
		};
	}
} satisfies Transition;

export const scrollUpToDown: Transition = {
	in(node, { duration }) {
		return scroll.in(node, { duration, reverse: false });
	},
	out(node, { duration }) {
		return scroll.out(node, { duration, reverse: false });
	}
};

export const scrollDownToUp: Transition = {
	in(node, { duration }) {
		return scroll.in(node, { duration, reverse: true });
	},
	out(node, { duration }) {
		return scroll.out(node, { duration, reverse: true });
	}
};
