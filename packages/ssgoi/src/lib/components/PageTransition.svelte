<script lang="ts">
	import context from '$lib/context/index.js';
	import { none } from '$lib/transitions/index.js';
	import type { TransitionConfig } from '$lib/types.js';

	const config = context.config.get();
	const scrollHistoryContext = context.scrollHistory.get();
	const pageTransitionContext = context.pageTransition.get();
	const getFromScrollTop = () =>
		(pageTransitionContext.from == null
			? undefined
			: (scrollHistoryContext[pageTransitionContext.from.url.pathname] ?? 0)) ?? 0;

	function transitionIn(
		node: HTMLElement,
		params: { getScrollTop: () => number }
	): TransitionConfig {
		const { from, to } = pageTransitionContext;
		if (from == null || to == null) return none().in(node, params);

		const transition = config({ path: from.url.pathname }, { path: to.url.pathname });
		return transition.in(node, params);
	}

	function transitionOut(
		node: HTMLElement,
		params: { getScrollTop: () => number }
	): TransitionConfig {
		const { from, to } = pageTransitionContext;
		if (from == null || to == null) return none().out(node, params);

		const transition = config({ path: from.url.pathname }, { path: to.url.pathname });
		return transition.out(node, params);
	}
</script>

<div
	in:transitionIn|global={{ getScrollTop: getFromScrollTop }}
	out:transitionOut|global={{ getScrollTop: getFromScrollTop }}
>
	<slot />
</div>
