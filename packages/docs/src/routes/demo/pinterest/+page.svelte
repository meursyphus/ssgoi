<script lang="ts">
	import { PageTransition, Pinterest } from 'ssgoi';

	const items = [
		{ color: 'red', height: 300 },
		{ color: 'blue', height: 250 },
		{ color: 'green', height: 350 },
		{ color: 'yellow', height: 200 },
		{ color: 'purple', height: 280 },
		{ color: 'orange', height: 320 },
		{ color: 'pink', height: 270 },
		{ color: 'cyan', height: 230 },
		{ color: 'magenta', height: 310 }
	];
</script>

<PageTransition>
	<div class="masonry-gallery">
		<h1>Color Masonry Gallery</h1>
		<p class="intro">
			Explore our unique collection of colored boxes. Click on any box to see details!
		</p>
		<div class="masonry-container">
			{#each items as item (item.color)}
				<Pinterest key={item.color}>
					<a
						href="/demo/pinterest/{item.color}"
						class="masonry-item"
						style="background-color: {item.color}; height: {item.height}px;"
					>
						<div class="item-info">
							<h2>{item.color}</h2>
							<p>{item.height}px</p>
						</div>
					</a>
				</Pinterest>
			{/each}
		</div>
	</div>
</PageTransition>

<style>
	.masonry-gallery {
		padding: 2rem;
	}

	h1 {
		color: #2c3e50;
		text-align: center;
		margin-bottom: 1rem;
	}

	.intro {
		color: #7f8c8d;
		text-align: center;
		max-width: 600px;
		margin: 0 auto 2rem;
	}

	.masonry-container {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		max-height: 1000px; /* Adjust this value based on your needs */
		gap: 1rem;
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

	@media (max-width: 1200px) {
		.masonry-item {
			width: calc(33.333% - 1rem);
		}
	}

	@media (max-width: 900px) {
		.masonry-item {
			width: calc(50% - 1rem);
		}
	}

	@media (max-width: 600px) {
		.masonry-item {
			width: 100%;
		}
	}

	.masonry-item:hover {
		transform: scale(1.05);
	}

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
</style>
