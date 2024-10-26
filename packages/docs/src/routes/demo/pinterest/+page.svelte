<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import { items } from './images';
	import Masonry from '$lib/components/masonry.svelte';
	let [minColWidth, maxColWidth, gap] = [200, 800, 20];
</script>

<PageTransition>
	<div class="masonry-gallery">
		<div class="h1">Color Masonry Gallery</div>
		<p class="intro">
			Explore our unique collection of colored boxes. Click on any box to see details!
		</p>
		<Masonry
			calcCols={() => 2}
			getId={(item: any) => item.color}
			{items}
			{minColWidth}
			{maxColWidth}
			{gap}
		>
			{#snippet children({ item })}
				<a
					aria-label={item.color}
					href="/demo/pinterest/{item.color}"
					class="masonry-item"
					style="background-color: {item.color}; aspect-ratio: {item.aspectRatio};"
					data-pinterest-key={item.color}
				>
				</a>
			{/snippet}
		</Masonry>
	</div>
</PageTransition>

<style>
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
