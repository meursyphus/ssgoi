import type { TransitionConfig } from 'svelte/transition';

type GetTranstionConfig = (node: Element) => TransitionConfig;

export type Transition = {
	in: GetTranstionConfig;
	out: GetTranstionConfig;
};
