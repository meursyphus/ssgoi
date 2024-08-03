<script lang="ts">
	import { PageTransition, Hero } from 'ssgoi';
	import { page } from '$app/stores';
	const a = $page.params.color;
</script>

<PageTransition>
	<div class="root">
		<Hero key={a}>
			<a href="/demo/image" style="background: {$page.params.color}" class="box"
				>{$page.params.color}</a
			>
		</Hero>
	</div>
</PageTransition>

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
