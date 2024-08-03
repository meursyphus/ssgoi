<script lang="ts">
	import context from '$lib/context/index.js';
	import { none } from '$lib/transitions/index.js';

	const config = context.config.get();
	const pageTransitionContext = context.pageTransition.get();

	function transitionIn(node: Element) {
		const { from, to } = pageTransitionContext;
		if (from == null || to == null) return none.in(node, {});
		const transition = config({ path: from!.url.pathname }, { path: to!.url.pathname });
		return transition.in(node, {});
	}

	function transitionOut(node: Element) {
		const { from, to } = pageTransitionContext;
		const transition = config({ path: from!.url.pathname }, { path: to!.url.pathname });
		return transition.out(node, {});
	}
</script>

<div in:transitionIn|global out:transitionOut|global>
	<slot />
</div>
