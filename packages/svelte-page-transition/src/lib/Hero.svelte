<script lang="ts">
	import context from '$lib/context/index.js';
	export let key: string;

	const pageTranstionContext = context.pageTranstion.get();
	const scrollHistoryContext = context.scrollHistory.get();
	const scrollTop =
		pageTranstionContext.from == null
			? undefined
			: scrollHistoryContext[pageTranstionContext.from.url.pathname];
	const { receive, send } = context.hero.get();
</script>

<div data-hero-transition in:receive|global={{ key, scrollTop }} out:send|global={{ key }}>
	<slot />
</div>
