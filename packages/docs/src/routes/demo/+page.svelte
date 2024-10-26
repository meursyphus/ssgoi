<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let currentFeature = $state(0);
	const features = [
		{ title: 'Smooth Transitions', description: 'Create seamless page transitions with ease.' },
		{ title: 'Flexible Configuration', description: 'Customize transitions for different routes.' },
		{
			title: 'Performance Optimized',
			description: 'Enjoy smooth animations without sacrificing speed.'
		},
		{ title: 'Easy Integration', description: 'Integrate SSGOI into your Svelte app in minutes.' }
	];

	onMount(() => {
		const interval = setInterval(() => {
			currentFeature = (currentFeature + 1) % features.length;
		}, 3000);

		return () => clearInterval(interval);
	});
</script>

<PageTransition>
	<div class="demo-landing">
		<h1>Welcome to SSGOI Demo</h1>
		<p class="tagline">Experience the magic of smooth page transitions</p>

		<div class="feature-showcase">
			{#key currentFeature}
				<h2 style="position: absolute; top: 40px;" transition:fade>
					{features[currentFeature].title}
				</h2>
				<p style="position: absolute; top: 100px;" transition:fade>
					{features[currentFeature].description}
				</p>
			{/key}
		</div>

		<div class="demo-links">
			<h3>Explore Our Demos</h3>
			<div class="link-container">
				<a href="/demo/blog" class="demo-link">Blog Demo</a>
				<a href="/demo/image" class="demo-link">Image Gallery Demo</a>
				<a href="/demo/post" class="demo-link">Post Demo</a>
			</div>
		</div>
	</div>
</PageTransition>

<style>
	.demo-landing {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		text-align: center;
	}

	h1 {
		color: #3498db;
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.tagline {
		color: #7f8c8d;
		font-size: 1.2rem;
		margin-bottom: 2rem;
	}

	.feature-showcase {
		background-color: #ecf0f1;
		border-radius: 8px;
		padding: 2rem;
		margin-bottom: 2rem;
		transition: all 0.3s ease;
		height: 150px;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.feature-showcase h2 {
		color: #2c3e50;
		margin-bottom: 1rem;
	}

	.feature-showcase p {
		color: #34495e;
	}

	.demo-links h3 {
		color: #2c3e50;
		margin-bottom: 1rem;
	}

	.link-container {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.demo-link {
		display: inline-block;
		background-color: #3498db;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		text-decoration: none;
		transition: background-color 0.3s ease;
	}

	.demo-link:hover {
		background-color: #2980b9;
	}

	@media (max-width: 600px) {
		.link-container {
			flex-direction: column;
		}
	}
</style>
