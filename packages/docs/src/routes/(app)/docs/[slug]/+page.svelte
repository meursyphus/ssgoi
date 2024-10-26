<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title} - SSGOI Documentation</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta name="description" content={data.meta.description} />
</svelte:head>

<article class="doc-content">
	<div class="content">
		<data.content />
	</div>
</article>

<style>
	.doc-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.content :global(h1) {
		font-size: var(--font-size-3xl);
		margin-bottom: var(--spacing-6);
		color: var(--color-text-light);
	}

	.content :global(h2) {
		font-size: var(--font-size-2xl);
		margin-top: var(--spacing-8);
		margin-bottom: var(--spacing-4);
		color: var(--color-text-light);
	}

	.content :global(h3) {
		font-size: var(--font-size-xl);
		margin-top: var(--spacing-6);
		margin-bottom: var(--spacing-3);
		color: var(--color-text-light);
	}

	.content :global(p) {
		margin-bottom: var(--spacing-4);
		line-height: 1.6;
	}

	.content :global(ul),
	.content :global(ol) {
		margin-bottom: var(--spacing-4);
		padding-left: var(--spacing-6);
	}

	.content :global(li) {
		margin-bottom: var(--spacing-2);
	}

	.content :global(pre) {
		margin-bottom: var(--spacing-4);
		padding: var(--spacing-4);
		border-radius: var(--radius-md);
		overflow-x: auto;
	}

	.content :global(code) {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
	}

	.content :global(a) {
		color: var(--color-primary-light);
		text-decoration: none;
		transition: color 0.3s;
	}

	.content :global(a:hover) {
		text-decoration: underline;
	}

	/* Dark mode styles */
	:global(html[color-scheme='dark']) .content :global(h1),
	:global(html[color-scheme='dark']) .content :global(h2),
	:global(html[color-scheme='dark']) .content :global(h3) {
		color: var(--color-text-dark);
	}

	:global(html[color-scheme='dark']) .content :global(a) {
		color: var(--color-primary-dark);
	}

	:global(html[color-scheme='dark']) .content :global(pre) {
		background-color: var(--color-bg-dark);
	}
</style>
