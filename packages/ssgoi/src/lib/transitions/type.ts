import type { TransitionConfig } from 'svelte/transition';

type GetTranstionConfig = (node: HTMLElement) => (TransitionConfig | (() => TransitionConfig));

export type Transition<T = object> = (params?: T) => {
	in: GetTranstionConfig;
	out: GetTranstionConfig;
};
