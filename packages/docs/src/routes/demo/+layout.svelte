<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { Ssgoi } from 'ssgoi';
	import config from './example-config.js';
</script>

<div class="root">
	<header>
		<nav>
			<a href="/demo/blog">Blog</a>
			<a href="/demo/post">Post</a>
			<a href="/demo/image">Image</a>
		</nav>
	</header>
	<main>
		<Ssgoi {onNavigate} {config}>
			<slot />
		</Ssgoi>
	</main>
	<footer>
		<p>&copy; 2023 SSGOI Demo. All rights reserved.</p>
		<div class="social-links">
			<a href="#" aria-label="Facebook">FB</a>
			<a href="#" aria-label="Twitter">TW</a>
			<a href="#" aria-label="Instagram">IG</a>
		</div>
	</footer>
</div>

<style>
	.root {
		font-family: 'Roboto', sans-serif;
		background-color: #f0f4f8;
		color: #333;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main > :global(div > div) {
		background-color: #f0f4f8;
	}

	header {
		background-color: #3498db;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	nav {
		display: flex;
		justify-content: center;
		gap: 2rem;
	}

	header a {
		color: white;
		text-decoration: none;
		font-weight: bold;
		font-size: 1.1rem;
		transition: color 0.3s ease;
	}

	header a:hover {
		color: #ecf0f1;
	}

	main {
		flex-grow: 1;
		padding: 2rem;
	}

	footer {
		background-color: #34495e;
		color: white;
		padding: 1rem;
		text-align: center;
	}

	.social-links {
		margin-top: 0.5rem;
	}

	.social-links a {
		color: white;
		margin: 0 0.5rem;
		text-decoration: none;
	}
</style>
