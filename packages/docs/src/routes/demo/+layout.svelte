<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Ssgoi } from 'ssgoi';
	import config from './page-config.js';
	interface Props {
		children?: import('svelte').Snippet;
	}
	let { children }: Props = $props();
</script>

<svelte:head>
	<title>SSGOI Demo - Interactive Page Transition Examples</title>
	<meta name="description" content="Explore interactive demos of SSGOI page transitions. See beautiful scroll, hero, pinterest, and ripple effects in action." />
	
	<!-- Open Graph -->
	<meta property="og:title" content="SSGOI Demo - Interactive Page Transition Examples" />
	<meta property="og:description" content="Explore interactive demos of SSGOI page transitions. See beautiful scroll, hero, pinterest, and ripple effects in action." />
	<meta property="og:url" content="https://ssgoi.pages.dev/demo" />
	<meta property="og:image" content="https://ssgoi.pages.dev/demo-og-image.png" />
	
	<!-- Twitter Card -->
	<meta name="twitter:title" content="SSGOI Demo - Interactive Page Transition Examples" />
	<meta name="twitter:description" content="Explore interactive demos of SSGOI page transitions. See beautiful scroll, hero, pinterest, and ripple effects in action." />
	<meta name="twitter:image" content="https://ssgoi.pages.dev/demo-og-image.png" />
</svelte:head>

<div class="demo-root">
	<div class="mobile-frame">
		<main>
			<Ssgoi {onNavigate} {config}>
				{@render children?.()}
			</Ssgoi>
		</main>
		<nav class="bottom-nav">
			<a href="/demo/post" class="nav-item" class:active={$page.url.pathname.startsWith('/demo/post')}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
					<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
				</svg>
				<span>Posts</span>
			</a>
			<a href="/demo/products" class="nav-item" class:active={$page.url.pathname.startsWith('/demo/products')}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="9" cy="21" r="1"></circle>
					<circle cx="20" cy="21" r="1"></circle>
					<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
				</svg>
				<span>Shop</span>
			</a>
			<a href="/demo/pinterest" class="nav-item" class:active={$page.url.pathname.startsWith('/demo/pinterest')}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="3" y="3" width="7" height="7"></rect>
					<rect x="14" y="3" width="7" height="7"></rect>
					<rect x="14" y="14" width="7" height="7"></rect>
					<rect x="3" y="14" width="7" height="7"></rect>
				</svg>
				<span>Pinterest</span>
			</a>
			<a href="/demo/profile" class="nav-item" class:active={$page.url.pathname.startsWith('/demo/profile')}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
					<circle cx="12" cy="7" r="4"></circle>
				</svg>
				<span>Profile</span>
			</a>
		</nav>
	</div>
</div>

<style>
	.demo-root {
		font-family: var(--font-sans);
		color: var(--color-text);
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #f0f0f0;
	}
	
	.mobile-frame {
		width: 100%;
		max-width: 440px;
		height: 100vh;
		max-height: 844px; /* iPhone 12 Pro height */
		background: var(--color-bg);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
	}
	
	@media (min-width: 481px) {
		.mobile-frame {
			border-radius: 20px;
			margin: 2rem;
			height: calc(100vh - 4rem);
		}
	}

	:global(.demo-root) {
		--font-mono: ui-monospace, 'SF Mono', 'Cascadia Code', 'Segoe UI Mono', monospace;
		--font-sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
		--color-bg: #ffffff;
		--color-text: #1a1a1a;
		--color-accent: #2a2a2a;
		--color-subtle: #f5f5f5;
		--header-bg: var(--color-bg);
		--header-text: var(--color-text);
		--footer-bg: var(--color-subtle);
		--footer-text: var(--color-text);
	}

	main {
		flex: 1;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		box-sizing: border-box;
	}
	
	.bottom-nav {
		display: flex;
		justify-content: space-around;
		align-items: center;
		background: var(--color-bg);
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		padding: 0.5rem 0;
		flex-shrink: 0;
	}
	
	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem;
		text-decoration: none;
		color: #666;
		font-size: 0.75rem;
		transition: color 0.2s ease;
		min-width: 64px;
	}
	
	.nav-item:hover,
	.nav-item:focus {
		color: var(--color-text);
	}
	
	.nav-item.active {
		color: #007AFF;
	}
	
	.nav-item svg {
		width: 24px;
		height: 24px;
		stroke-width: 1.5;
	}

	@media (max-width: 380px) {
		.nav-item {
			font-size: 0.7rem;
			min-width: 56px;
		}
		
		.nav-item svg {
			width: 20px;
			height: 20px;
		}
	}
</style>
