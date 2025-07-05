<script lang="ts">
	import '../app.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<meta name="description" content="SSGOI - Beautiful page transitions for Svelte and SvelteKit applications. Create smooth, elegant transitions with minimal configuration." />
	<meta name="keywords" content="svelte, sveltekit, page transitions, animation, ssgoi, smooth transitions" />
	<meta name="author" content="SSGOI Team" />
	
	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="SSGOI - Smooth Page Transitions for Svelte" />
	<meta property="og:description" content="Create beautiful, smooth page transitions in your Svelte and SvelteKit applications with minimal configuration." />
	<meta property="og:url" content="https://ssgoi.pages.dev" />
	<meta property="og:image" content="https://ssgoi.pages.dev/og-image.png" />
	<meta property="og:site_name" content="SSGOI" />
	<meta property="og:locale" content="en_US" />
	
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="SSGOI - Smooth Page Transitions for Svelte" />
	<meta name="twitter:description" content="Create beautiful, smooth page transitions in your Svelte and SvelteKit applications with minimal configuration." />
	<meta name="twitter:image" content="https://ssgoi.pages.dev/og-image.png" />
	
	<!-- Additional Meta Tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#000000" />
	<link rel="canonical" href="https://ssgoi.pages.dev" />
</svelte:head>

{@render children?.()}
