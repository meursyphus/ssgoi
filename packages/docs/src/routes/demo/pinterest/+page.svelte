<script lang="ts">
	import { PageTransition, Pinterest } from 'ssgoi';
	import { items } from './images';
	import Masonry from '$lib/components/masonry.svelte';
</script>

<PageTransition>
	<div class="masonry-gallery">
		<div class="h1">Color Masonry Gallery</div>
		<p class="intro">
			Explore our unique collection of colored boxes. Click on any box to see details!
		</p>
		<Masonry {items} gridGap="1rem" colWidth="calc(50% - 1rem)">
			{#each items as item, index (item.color)}
				<a
					href="/demo/pinterest/{item.color}"
					class="masonry-item"
					style="background-color: {item.color}; aspect-ratio: {item.aspectRatio};"
					data-pinterest-key={item.color}
				>
					<div class="item-info">
						<h2>{item.color}</h2>
					</div>
				</a>
			{/each}
		</Masonry>
	</div>
</PageTransition>

<style>
	.masonry-gallery {
	}
	.h1 {
		color: #2c3e50;
		text-align: center;
		margin-bottom: 1rem;
		font-size: 2rem;
		font-weight: 700;
	}
	.intro {
		color: #7f8c8d;
		text-align: center;
		max-width: 600px;
		margin: 0 auto 2rem;
	}

	/* .masonry-item:hover {
		transform: scale(1.05);
	} */
	.item-info {
		background: rgba(0, 0, 0, 0.5);
		width: 100%;
		padding: 0.5rem;
		text-align: center;
	}
	h2 {
		margin: 0;
		font-size: 1.2rem;
	}
	p {
		margin: 0.5rem 0 0;
	}
	.masonry-item {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		text-decoration: none;
		color: white;
	}
</style>
