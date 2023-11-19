<script lang="ts">
	import { onNavigate, beforeNavigate } from '$app/navigation';
	import { PageTransitionRoot } from '$lib/index.js';
</script>

<div class="root">
	<header>
		<a href="/blog">Blog</a>
		<a href="/post">Post</a>
		<a href="/image">Image</a>
	</header>
	<main>
		<PageTransitionRoot {onNavigate}>
			<slot />
		</PageTransitionRoot>
	</main>

	<footer>this is footer</footer>
</div>

<style>
	header {
		background-color: #f00;
		height: 60px;
		font-size: large;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 24px;
	}

	footer {
		background-color: black;
		color: white;
		height: 300px;
		font-size: xx-large;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.root {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		background-color: bisque;
	}

	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	:global(body) {
		flex-grow: 1;
	}

	:global(html) {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: blue;
		overflow-y: scroll;
	}
</style>
