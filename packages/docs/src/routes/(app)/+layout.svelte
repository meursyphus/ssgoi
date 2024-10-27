<script lang="ts">
	import Header from './header.svelte';
	import Footer from './footer.svelte';
	import { MetaTags, deepMerge, type MetaTagsProps } from 'svelte-meta-tags';
	import { page } from '$app/stores';
	interface Props {
		children?: import('svelte').Snippet;
		data: {
			baseMetaTags: MetaTagsProps;
		};
	}

	let { children, data }: Props = $props();
	const metaTags = $derived(deepMerge(data.baseMetaTags, $page.data.pageMetaTags || {}));
</script>

<div class="app">
	<Header />
	<main>
		<MetaTags {...metaTags} />
		{@render children?.()}
	</main>
	<Footer />
</div>

<style>
	:global(html, body) {
		height: 100%;
		margin: 0;
		padding: 0;
	}
	:global(body) {
		overflow-y: scroll;
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--color-bg-light);
		color: var(--color-text-light);
		transition:
			background-color 0.3s,
			color 0.3s;
	}

	main {
		flex: 1;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--spacing-4);
		box-sizing: border-box;
	}

	/* Dark mode styles */
	:global(html[color-scheme='dark']) .app {
		background-color: var(--color-bg-dark);
		color: var(--color-text-dark);
	}

	@media (max-width: 768px) {
		main {
			padding: var(--spacing-2);
		}
	}
</style>
