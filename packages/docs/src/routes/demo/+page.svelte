<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import { onMount } from 'svelte';

	let currentFeature = $state(0);
	const features = [
		{
			title: '쓱 - Quick & Smooth',
			description: 'Experience transitions as smooth as silk, swift as a breeze'
		},
		{
			title: 'すごい - Amazing Effects',
			description: 'A curated collection of beautiful transition effects'
		},
		{
			title: '簡単 - Easy to Use',
			description: 'Configure transitions with just a few lines of code'
		},
		{
			title: '最適化 - Optimized',
			description: 'Performant animations that feel natural'
		}
	];

	onMount(() => {
		const interval = setInterval(() => {
			currentFeature = (currentFeature + 1) % features.length;
		}, 3000);

		return () => clearInterval(interval);
	});
</script>

<PageTransition>
	<main class="container">
		<section class="hero">
			<div class="brand">
				<span class="korean">쓱</span>
				<span class="japanese">すごい</span>
			</div>
			<h1>Native-like transitions<br />for your Svelte apps</h1>
			<p class="tagline">Smooth as silk, simple as a brushstroke</p>
		</section>

		<section class="features">
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="background-animation" />
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="decorator" />

			{#key currentFeature}
				<div class="feature-content">
					<div class="feature-content-inner">
						<h2>{features[currentFeature].title}</h2>
						<p>{features[currentFeature].description}</p>
					</div>
				</div>
			{/key}

			<div class="progress-dots">
				{#each features as _, i}
					<button
						class="dot"
						class:active={currentFeature === i}
						onclick={() => (currentFeature = i)}
						aria-label={`Feature ${i + 1}`}
					></button>
				{/each}
			</div>
		</section>
		<section class="demos">
			<div class="demo-grid">
				<a href="/demo/blog">Blog</a>
				<a href="/demo/image">Gallery</a>
				<a href="/demo/post">Post</a>
			</div>
		</section>
	</main>
</PageTransition>

<style>
	.container {
		max-width: 64rem;
		margin: 0 auto;
		padding: 4rem 1.5rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 6rem;
	}

	.brand {
		margin-bottom: 2rem;
		font-family: var(--font-mono);
	}

	.korean {
		font-size: 3rem;
		font-weight: 700;
		color: var(--color-text);
		margin-right: 0.5rem;
	}

	.japanese {
		font-size: 1.5rem;
		color: var(--color-accent);
		opacity: 0.7;
	}

	h1 {
		font-family: var(--font-sans);
		font-size: 2.5rem;
		line-height: 1.2;
		font-weight: 700;
		color: var(--color-text);
		margin: 0 0 1rem;
	}

	.tagline {
		font-family: var(--font-mono);
		font-size: 1rem;
		color: var(--color-accent);
		opacity: 0.7;
	}

	.features {
		background: var(--color-subtle);
		border-radius: 1rem;
		height: 200px;
		position: relative;
		margin-bottom: 6rem;
		padding: 2rem;
		text-align: center;
		max-width: 600px;
		margin-inline: auto;
	}

	.features h2 {
		font-family: var(--font-sans);
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
	}

	.features p {
		color: var(--color-accent);
		opacity: 0.8;
	}

	.demo-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		max-width: 30rem;
		margin: 0 auto;
	}

	.demo-grid a {
		font-family: var(--font-mono);
		text-decoration: none;
		color: var(--color-text);
		padding: 1rem;
		text-align: center;
		border: 1px solid var(--color-subtle);
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.demo-grid a:hover {
		background: var(--color-subtle);
	}

	@media (max-width: 640px) {
		.container {
			padding: 2rem 1rem;
		}

		h1 {
			font-size: 2rem;
		}

		.demo-grid {
			grid-template-columns: 1fr;
		}
	}
	.features {
		background: var(--color-subtle);
		border-radius: 1rem;
		height: 200px;
		position: relative;
		margin-bottom: 6rem;
		padding: 2rem;
		text-align: center;
		max-width: 600px;
		margin-inline: auto;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.background-animation {
		position: absolute;
		inset: 0;
		background: linear-gradient(45deg, var(--color-subtle), rgba(27, 49, 94, 0.1));
		opacity: 0.5;
		animation: gradient 8s ease infinite;
		z-index: 0;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.decorator {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 60px;
		height: 60px;
		border: 2px solid rgba(27, 49, 94, 0.1);
		border-radius: 50%;
		animation: rotate 20s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.feature-content {
		position: relative;
		z-index: 1;
		padding: 1rem;
	}

	.features h2 {
		font-family: var(--font-sans);
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.5rem 0;
	}

	.features p {
		color: var(--color-accent);
		opacity: 0.8;
		max-width: 480px;
		margin: 0 auto;
	}

	.progress-dots {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-accent);
		opacity: 0.3;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: opacity 0.3s ease;
	}

	.dot.active {
		opacity: 0.8;
	}
</style>
