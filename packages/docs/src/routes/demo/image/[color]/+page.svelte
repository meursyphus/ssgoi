<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const color = '#' + $page.params.color;
	let textColor = $state('white');
	let copied = $state(false);

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
	<div data-to data-hero-key={color} class="root" style="background-color: {color}; color: {textColor};">
		<div class="color-info">
			<h1>{color}</h1>
			<button onclick={copyToClipboard} style="color: {textColor}; border-color: {textColor};">
				{copied ? 'Copied!' : 'Copy HEX'}
			</button>
		</div>
		<a href="/demo/image" class="back-link" style="color: {textColor};">Back to Gallery</a>
	</div>
</PageTransition>

<style>
	.root {
		height: calc(100vh - 64px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: background-color 0.3s ease;
	}

	.color-info {
		text-align: center;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	button {
		background: transparent;
		border: 2px solid;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		cursor: pointer;
		transition: opacity 0.3s ease;
	}

	button:hover {
		opacity: 0.8;
	}

	.back-link {
		position: absolute;
		bottom: 2rem;
		text-decoration: none;
		font-weight: bold;
		transition: opacity 0.3s ease;
	}

	.back-link:hover {
		opacity: 0.8;
	}
</style>
