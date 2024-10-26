<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { items } from '../images';

	const color = $page.params.color;
	const height = 300; // This should be dynamically fetched based on the color
	let textColor = 'white';
	let copied = $state(false);
	const ratio = items.find((item) => item.color === color)!.aspectRatio;

	onMount(() => {
		// Simple function to determine if text should be black or white based on background color
		const r = parseInt(color.slice(1, 3), 16);
		const g = parseInt(color.slice(3, 5), 16);
		const b = parseInt(color.slice(5, 7), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		textColor = luminance > 0.5 ? 'black' : 'white';
	});

	function copyToClipboard() {
		navigator.clipboard.writeText(color);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<PageTransition>
	<div class="root">
		<div
			data-pinterest-key={color}
			class="color-box"
			style="background-color: {color}; aspect-ratio: {ratio};"
		></div>
		<div class="content">
			<div class="color-info">
				<h1>{color}</h1>
				<p>Height: {height}px</p>
				<button onclick={copyToClipboard}>
					{copied ? 'Copied!' : 'Copy Color'}
				</button>
			</div>
			<p class="description">
				This is a beautiful {color} box with a height of {height}px. It's part of our unique
				collection of colored boxes in the masonry gallery.
			</p>
			<a href="/demo/pinterest" class="back-link">Back to Pinterest</a>
		</div>
	</div>
</PageTransition>

<style>
	.root {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.color-box {
		width: 100%;
		border-radius: 16px;
	}

	.content {
		flex-grow: 1;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.color-info {
		text-align: center;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	p {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #34495e;
	}

	button {
		background: #3498db;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
		border-radius: 4px;
	}

	button:hover {
		background-color: #2980b9;
	}

	.description {
		font-size: 1rem;
		max-width: 600px;
		text-align: center;
		margin: 2rem 0;
	}

	.back-link {
		text-decoration: none;
		font-weight: bold;
		color: #3498db;
		transition: color 0.3s ease;
	}

	.back-link:hover {
		color: #2980b9;
	}
</style>
