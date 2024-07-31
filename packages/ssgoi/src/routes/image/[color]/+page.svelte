<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Page from '$lib/components/Page.svelte';
	import { page } from '$app/stores';
	const a = $page.params.color;
</script>

<Page>
<div class="root">
	<Hero key={a}>
		<a href="/image" style="background: {$page.params.color}" class="box">{$page.params.color}</a>
	</Hero>
	</div>
</Page>

<style>
	.root {
		height: calc(100vh - 64px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.box {
		display: block;
		width: 400px;
		height: 400px;
		aspect-ratio: 1;
	}
</style>
