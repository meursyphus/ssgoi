import type { TransitionConfig } from 'svelte/transition';

type GetTranstionConfig = (node: Element, option: { duration?: number }) => TransitionConfig;

export type Transition = {
	in: GetTranstionConfig;
	out: GetTranstionConfig;
};
