import type { OnNavigate } from '@sveltejs/kit';
import { getContext, setContext } from 'svelte';

const KEY = Symbol('page-transtion-naviation');

type PageTranstionContext = {
	from: OnNavigate['from'];
	to: OnNavigate['to'];
};

export const init = () => {
	const context: PageTranstionContext = { from: null, to: null };
	setContext(KEY, context);
	return context;
};

export const get = () => {
	return getContext<PageTranstionContext>(KEY);
};
