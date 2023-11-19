import { getContext, setContext } from 'svelte';

const KEY = Symbol('scroll-history');

type ScrollHistoryContext = Record<string, number>;

export const init = () => {
	const context: ScrollHistoryContext = {};
	setContext(KEY, context);
	return context;
};

export const get = () => {
	return getContext<ScrollHistoryContext>(KEY);
};
