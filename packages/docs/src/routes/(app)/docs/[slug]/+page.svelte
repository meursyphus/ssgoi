<script lang="ts">
	let { data } = $props();
</script>

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
		font-size: var(--font-size-4xl);
		margin-bottom: var(--spacing-8);
		color: var(--color-text-light);
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.content :global(h2) {
		font-size: var(--font-size-2xl);
		margin-top: var(--spacing-12);
		margin-bottom: var(--spacing-6);
		color: var(--color-text-light);
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.content :global(h3) {
		font-size: var(--font-size-xl);
		margin-top: var(--spacing-8);
		margin-bottom: var(--spacing-4);
		color: var(--color-text-light);
		font-weight: 600;
	}

	.content :global(p) {
		margin-bottom: var(--spacing-6);
		line-height: 1.8;
		color: var(--color-text-secondary-light);
	}

	.content :global(ul),
	.content :global(ol) {
		margin-bottom: var(--spacing-6);
		padding-left: var(--spacing-8);
	}

	.content :global(li) {
		margin-bottom: var(--spacing-3);
		color: var(--color-text-secondary-light);
	}

	.content :global(pre) {
		margin: var(--spacing-8) 0;
		padding: var(--spacing-6);
		background-color: var(--color-hover-light);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-sm);
		overflow-x: auto;
	}

	.content :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
	}

	.content :global(:not(pre) > code) {
		background-color: var(--color-hover-light);
		padding: 0.2em 0.4em;
		border-radius: var(--radius-sm);
		font-weight: 500;
	}

	.content :global(a) {
		color: var(--color-text-light);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 2px;
		transition: opacity 0.15s;
	}

	.content :global(a:hover) {
		opacity: 0.6;
	}

	/* Dark mode styles */
	:global(html[color-scheme='dark']) .content :global(h1),
	:global(html[color-scheme='dark']) .content :global(h2),
	:global(html[color-scheme='dark']) .content :global(h3) {
		color: var(--color-text-dark);
	}

	:global(html[color-scheme='dark']) .content :global(p),
	:global(html[color-scheme='dark']) .content :global(li) {
		color: var(--color-text-secondary-dark);
	}

	:global(html[color-scheme='dark']) .content :global(a) {
		color: var(--color-text-dark);
	}

	:global(html[color-scheme='dark']) .content :global(pre) {
		background-color: var(--color-hover-dark);
		border-color: var(--color-border-dark);
	}

	:global(html[color-scheme='dark']) .content :global(:not(pre) > code) {
		background-color: var(--color-hover-dark);
	}
</style>
