<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import * as config from '$lib/config';
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="landing-page" in:fade={{ duration: 300, delay: 300 }}>
	<section class="hero" in:fly={{ y: 50, duration: 500, delay: 300 }}>
		<h1>{config.title}</h1>
		<p>Turning Your Site into Supermodels!</p>
		<div class="cta-buttons">
			<a href="/docs" class="btn btn-primary">Get Started</a>
			<a href="/demo" class="btn btn-secondary" target="_blank" rel="noopener noreferrer"
				>Watch Demo</a
			>
		</div>
	</section>

	<section class="features" in:fly={{ y: 50, duration: 500, delay: 500 }}>
		<h2>Key Features</h2>
		<div class="feature-grid">
			<div class="feature-card">
				<h3>Smooth Transitions</h3>
				<p>Effortless page transitions that captivate your audience.</p>
			</div>
			<div class="feature-card">
				<h3>Easy Integration</h3>
				<p>Seamlessly integrate with your existing Svelte projects.</p>
			</div>
			<div class="feature-card">
				<h3>Customizable</h3>
				<p>Tailor transitions to match your brand and design.</p>
			</div>
			<div class="feature-card">
				<h3>Performance Optimized</h3>
				<p>Smooth transitions without sacrificing load times.</p>
			</div>
		</div>
	</section>
</div>

<style>
	.landing-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--spacing-8);
	}

	.hero {
		text-align: center;
		margin-bottom: var(--spacing-16);
	}

	h1 {
		font-size: var(--font-size-4xl);
		margin-bottom: var(--spacing-4);
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: var(--spacing-4);
		margin-top: var(--spacing-8);
	}

	.btn {
		padding: var(--spacing-3) var(--spacing-6);
		border-radius: var(--radius-md);
		font-weight: bold;
		text-decoration: none;
		transition:
			background-color 0.3s,
			color 0.3s;
	}

	.btn-primary {
		background-color: var(--color-primary-light);
		color: white;
	}

	.btn-secondary {
		background-color: var(--color-secondary-light);
		color: white;
	}

	.features {
		text-align: center;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--spacing-8);
		margin-top: var(--spacing-8);
	}

	.feature-card {
		background-color: var(--color-bg-light);
		padding: var(--spacing-6);
		border-radius: var(--radius-lg);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}

	.feature-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	/* Dark mode styles */
	:global(html[color-scheme='dark']) .btn-primary {
		background-color: var(--color-primary-dark);
	}

	:global(html[color-scheme='dark']) .btn-secondary {
		background-color: var(--color-secondary-dark);
	}

	:global(html[color-scheme='dark']) .feature-card {
		background-color: var(--color-bg-dark);
		box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
	}

	@media (max-width: 768px) {
		.cta-buttons {
			flex-direction: column;
		}
	}
</style>
