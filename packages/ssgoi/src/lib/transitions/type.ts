import type { TransitionConfig } from 'svelte/transition';

type GetTranstionConfig = (node: Element) => TransitionConfig;

export type Transition<T = object> = (params?: T) => {
	in: GetTranstionConfig;
	out: GetTranstionConfig;
};
