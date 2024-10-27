<!-- @migration-task Error while migrating Svelte code: `<a>` is invalid inside `<a>` -->
<script lang="ts">
	import { page } from '$app/stores';
	import { theme, toggleTheme } from '$lib/theme';
	import { Moon, Sun } from 'lucide-svelte';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<header>
	<div class="header-content">
		<a href="/" class="logo">
			<img src="/icon.svg" alt="SSGOI" />
			<span>SSGOI</span>
		</a>
		<nav class:open={isMenuOpen}>
			<a href="/docs" class:active={$page.url.pathname.startsWith('/docs')}>Docs</a>
			<a href="/demo">Demo</a>
			<a href="https://github.com/meursyphus/ssgoi" aria-label="GitHub">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					fill="currentColor"
					class="github-icon"
				>
					<path
						d="M12 .297c-6.627 0-12 5.373-12 12 0 5.304 3.438 9.8 8.205 11.388.6.111.82-.26.82-.577 0-.285-.011-1.237-.017-2.24-3.338.724-4.043-1.607-4.043-1.607-.546-1.384-1.333-1.754-1.333-1.754-1.086-.743.083-.728.083-.728 1.204.085 1.838 1.236 1.838 1.236 1.067 1.826 2.8 1.298 3.48.992.108-.774.418-1.298.76-1.598-2.665-.303-5.467-1.333-5.467-5.933 0-1.313.469-2.386 1.236-3.227-.124-.303-.536-1.53.117-3.185 0 0 1.008-.322 3.303 1.227a11.53 11.53 0 0 1 3.003-.404c1.02.004 2.042.138 3.003.404 2.295-1.55 3.303-1.227 3.303-1.227.653 1.655.241 2.882.118 3.185.77.841 1.236 1.914 1.236 3.227 0 4.61-2.805 5.63-5.475 5.925.43.37.815 1.1.815 2.22 0 1.604-.014 2.898-.017 3.287 0 .319.218.694.825.577A12.002 12.002 0 0 0 24 12.297c0-6.627-5.373-12-12-12z"
					/>
				</svg>
			</a>
			<button on:click={toggleTheme} aria-label="Toggle theme">
				{#if $theme === 'light'}
					<Moon size={20} />
				{:else}
					<Sun size={20} />
				{/if}
			</button>
		</nav>
		<button class="menu-toggle" on:click={toggleMenu} aria-label="Toggle menu">
			<span></span>
			<span></span>
			<span></span>
		</button>
	</div>
</header>

<style>
	header {
		background-color: var(--color-bg-light);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 1000;
		transition: background-color 0.3s;
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-4);
	}

	.logo {
		font-size: var(--font-size-xl);
		font-weight: bold;
		color: var(--color-primary-light);
		text-decoration: none;
		transition: color 0.3s;
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
	}

	.logo img {
		width: 32px;
		height: 32px;
	}

	nav {
		display: flex;
		gap: var(--spacing-4);
		align-items: center;
	}

	nav a {
		color: var(--color-text-light);
		text-decoration: none;
		transition: color 0.3s;
	}

	nav a:hover,
	nav a.active {
		color: var(--color-primary-light);
	}

	button {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-light);
		transition: color 0.3s;
	}

	button:hover {
		color: var(--color-primary-light);
	}

	.menu-toggle {
		display: none;
	}

	/* Dark mode styles */
	:global(html[color-scheme='dark']) header {
		background-color: var(--color-bg-dark);
		box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
	}

	:global(html[color-scheme='dark']) .logo {
		color: var(--color-primary-dark);
	}

	:global(html[color-scheme='dark']) nav a {
		color: var(--color-text-dark);
	}

	:global(html[color-scheme='dark']) nav a:hover,
	:global(html[color-scheme='dark']) nav a.active {
		color: var(--color-primary-dark);
	}

	:global(html[color-scheme='dark']) button {
		color: var(--color-text-dark);
	}

	:global(html[color-scheme='dark']) button:hover {
		color: var(--color-primary-dark);
	}

	@media (max-width: 768px) {
		nav {
			display: none;
		}

		nav.open {
			display: flex;
			flex-direction: column;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background-color: var(--color-bg-light);
			padding: var(--spacing-4);
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		}

		.menu-toggle {
			display: block;
		}

		.menu-toggle span {
			display: block;
			width: 25px;
			height: 3px;
			background-color: var(--color-text-light);
			margin: 5px 0;
			transition: 0.3s;
		}

		:global(html[color-scheme='dark']) nav.open {
			background-color: var(--color-bg-dark);
			box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
		}

		:global(html[color-scheme='dark']) .menu-toggle span {
			background-color: var(--color-text-dark);
		}
	}
</style>
