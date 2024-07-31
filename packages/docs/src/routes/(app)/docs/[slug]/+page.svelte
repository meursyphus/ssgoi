<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>{data.meta.title} - SSGOI Documentation</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta name="description" content={data.meta.description} />
</svelte:head>

<article>
	<div class="content">
		<svelte:component this={data.content} />
	</div>
</article>

<style>
	article {
		max-width: 600px;
		margin: 0 auto;
	}

	.content :global(h1) {
		font-size: 2.5em;
		margin-bottom: 0.5em;
	}

	.content :global(h2) {
		font-size: 1.8em;
		margin-top: 1.5em;
		margin-bottom: 0.5em;
	}

	.content :global(p) {
		line-height: 1.6;
		margin-bottom: 1em;
	}

	.content :global(pre) {
		background-color: #f4f4f4;
		padding: 1em;
		border-radius: 4px;
		overflow-x: auto;
	}

	.content :global(code) {
		font-family: 'Courier New', Courier, monospace;
	}
</style>
