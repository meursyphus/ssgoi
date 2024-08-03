import type { Transition } from './type.js';
import { out } from './boilerflate/index.js';

const VELOCITY = 1.2;

const scroll = {
	in(node: Element, { reverse = false }: { reverse?: boolean }) {
		const height = window.innerHeight - node.clientTop;
		const duration = height / VELOCITY;

		return {
			duration,
			css(_: number, u: number) {
				return `transform: translateY(${(reverse ? 1 : -1) * u * height}px)`;
			}
		};
	},
	out(node: Element, { reverse = false }: {  reverse?: boolean }) {
		const height = window.innerHeight - node.clientTop;
		const duration = height / VELOCITY;
		return {
			duration,
			css(_: number, t: number) {
				return `${out} z-index: ${reverse ? -1 : 1}; transform: translateY(${
					(reverse ? -1 : 1) * t * height
				}px);`;
			}
		};
	}
} 

export const scrollUpToDown: Transition = {
	in(node) {
		return scroll.in(node, {  reverse: false });
	},
	out(node) {
		return scroll.out(node, { reverse: false });
	}
};

export const scrollDownToUp: Transition = {
	in(node) {
		return scroll.in(node, { reverse: true });
	},
	out(node) {
		return scroll.out(node, { reverse: true });
	}
};
