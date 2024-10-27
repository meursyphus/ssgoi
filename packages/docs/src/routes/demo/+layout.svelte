<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { Ssgoi } from 'ssgoi';
	import config from './page-config.js';
	interface Props {
		children?: import('svelte').Snippet;
	}
	let { children }: Props = $props();
</script>

<div class="demo-root">
	<header>
		<a aria-label="Home" class="home" href="/demo">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M12 3l9 9h-3v9h-6v-6h-6v6H3v-9H0l12-9z" />
			</svg>
		</a>
		<nav>
			<a href="/demo/blog">Blog</a>
			<a href="/demo/post">Post</a>
			<a href="/demo/image">Image</a>
			<a href="/demo/pinterest">Pinterest</a>
		</nav>
	</header>
	<main>
		<Ssgoi {onNavigate} {config}>
			{@render children?.()}
		</Ssgoi>
	</main>
	<footer>
		<p>&copy; 2023 SSGOI Demo. All rights reserved.</p>
	</footer>
</div>

<style>
	.demo-root {
		font-family: var(--font-sans);
		color: var(--color-text);
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: var(--color-bg);
	}

	:global(.demo-root) {
		--font-mono: ui-monospace, 'SF Mono', 'Cascadia Code', 'Segoe UI Mono', monospace;
		--font-sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
		--color-bg: #ffffff;
		--color-text: #1a1a1a;
		--color-accent: #2a2a2a;
		--color-subtle: #f5f5f5;
		--header-bg: var(--color-subtle);
		--header-text: var(--color-text);
		--footer-bg: var(--color-subtle);
		--footer-text: var(--color-text);
	}

	header {
		background-color: var(--header-bg);
		padding: 1.5rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	nav {
		display: flex;
		justify-content: center;
		gap: 3rem;
	}

	header a {
		color: var(--header-text);
		text-decoration: none;
		font-family: var(--font-mono);
		font-size: 0.9rem;
		letter-spacing: 0.5px;
		transition: opacity 0.2s ease;
	}

	header a:hover {
		opacity: 0.7;
	}

	.home {
		position: absolute;
		left: 32px;
	}

	.home svg {
		opacity: 0.8;
	}

	main {
		flex-grow: 1;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		background-color: var(--footer-bg);
		color: var(--footer-text);
		padding: 1.5rem;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 640px) {
		nav {
			gap: 1.5rem;
		}

		.home {
			left: 16px;
		}

		main {
			padding: 1rem;
		}
	}
</style>
