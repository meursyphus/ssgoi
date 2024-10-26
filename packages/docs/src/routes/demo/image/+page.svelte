<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import { faker } from '@faker-js/faker';
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';

	faker.seed(14);
	const colors = new FixtureFactory(() => ({
		name: faker.color.human(),
		hex: faker.color.rgb().slice(1),
		description: faker.lorem.sentence()
	})).createList(9);
</script>

<PageTransition>
	<div class="color-gallery">
		<h1>Color Gallery</h1>
		<p class="intro">Explore our curated collection of colors. Click on any color to learn more!</p>
		<div class="container">
			{#each colors as color (color.hex)}
				<div data-from data-hero-key={'#' + color.hex}>
					<a href="/demo/image/{color.hex}" class="color-card">
						<div style="background: #{color.hex};" class="color-box"></div>
						<div class="color-info">
							<h2>{color.name}</h2>
							<p>#{color.hex}</p>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</PageTransition>

<style>
	.color-gallery {
		text-align: center;
		padding: 2rem;
	}

	h1 {
		color: #2c3e50;
		margin-bottom: 1rem;
	}

	.intro {
		color: #7f8c8d;
		max-width: 600px;
		margin: 0 auto 2rem;
	}

	.container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		padding: 1rem;
	}

	.color-card {
		background-color: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		text-decoration: none;
		color: inherit;
	}

	.color-card:hover {
		transform: scale(1.05);
	}

	.color-box {
		height: 200px;
	}

	.color-info {
		padding: 1rem;
	}

	h2 {
		margin: 0;
		font-size: 1.2rem;
		color: #2c3e50;
	}

	p {
		margin: 0.5rem 0 0;
		color: #7f8c8d;
	}
</style>
