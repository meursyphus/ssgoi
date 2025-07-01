<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import Masonry from '$lib/components/masonry.svelte';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	let [minColWidth, maxColWidth, gap] = [200, 800, 20];
</script>

<PageTransition class="pinterest-page">
	<div class="masonry-gallery">
		<div class="h1">Pinterest-Style Gallery</div>
		<p class="intro">
			Explore our curated collection of inspiring images. Click on any pin to see details!
		</p>
		<Masonry
			calcCols={() => 2}
			getId={(item: any) => item.id}
			items={data.items}
			{minColWidth}
			{maxColWidth}
			{gap}
		>
			{#snippet children({ item })}
				<a
					aria-label={item.title}
					href="/demo/pinterest/{item.id}"
					class="masonry-item"
					style="aspect-ratio: {item.aspectRatio};"
					data-pinterest-key={item.id}
				>
					<img src={item.image} alt={item.title} loading="lazy" />
					<div class="pin-content">
						<h3>{item.title}</h3>
						<div class="pin-stats">
							<span>{item.saves.toLocaleString()} saves</span>
						</div>
					</div>
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
	.masonry-gallery {
		padding: 2rem 0;
		padding-inline: 16px;
		background: white;
	}
	.masonry-item {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
		text-decoration: none;
		color: white;
		position: relative;
		background-color: #f0f0f0;
	}
	
	.masonry-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
	}
	
	.masonry-item:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
	}
	
	.pin-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1rem;
		background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
		color: white;
	}
	
	.pin-content h3 {
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
		line-height: 1.2;
	}
	
	.pin-stats {
		font-size: 0.75rem;
		opacity: 0.9;
	}
</style>
