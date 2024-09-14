<script lang="ts">
	import type { onNavigate as _onNavigate } from '$app/navigation';
	import type { TransitionRouteConfig } from '$lib/types.js';
	import context from '../context/index.js';

	let className: string = '';
	export { className as class };

	export let onNavigate: typeof _onNavigate;
	export let config: TransitionRouteConfig;

	context.config.init(config);
	const pageTransitionContext = context.pageTransition.init();
	const scrollHistoryContext = context.scrollHistory.init();
	context.hero.init();

	onNavigate(({ from, to }) => {
		pageTransitionContext.from = from;
		pageTransitionContext.to = to;
	});

	onNavigate(({ from }) => {
		const path = from?.url.pathname;
		if (path == null) return;

		const { scrollingElement } = document;
		if (scrollingElement == null) return;

		scrollHistoryContext[path] = scrollingElement.scrollTop;
	});
</script>

<div data-ssgoi class="page-transition-root {className}">
	<slot />
</div>

<style>
	.page-transition-root {
		position: relative;
		z-index: 0;
		overflow: hidden;
	}
</style>
