<script lang="ts">
	import * as config from '$lib/config';
	import { Github, Twitter } from 'lucide-svelte/icons';
</script>

<footer>
	<div class="footer-content">
		<div class="project-info">
			<h2>{config.title}</h2>
			<p>A smooth page transition library for Svelte</p>
		</div>
		<div class="links">
			<div class="link-group">
				<h3>Docs</h3>
				<a href="/docs/getting-started">Getting Started</a>
				<a href="/docs/api-reference">API Reference</a>
				<a href="/docs/examples">Examples</a>
			</div>
			<div class="link-group">
				<h3>Community</h3>
				<a href="/docs/contributing">Contributing</a>
				<a href="https://github.com/meursyphus/ssgoi/issues">Report an Issue</a>
				<a href="/docs/code-of-conduct">Code of Conduct</a>
			</div>
			<div class="link-group">
				<h3>More</h3>
				<a href="https://github.com/meursyphus/ssgoi">GitHub</a>
				<a href="/blog">Blog</a>
				<a href="/changelog">Changelog</a>
			</div>
		</div>
	</div>
	<div class="bottom-bar">
		<p>© {new Date().getFullYear()} {config.title} Contributors. Open-source under MIT License.</p>
		<div class="social-links">
			<a href="https://github.com/meursyphus/ssgoi" aria-label="GitHub">
				<Github size={20} />
			</a>
			<a href="https://x.com/meursyphus" aria-label="Twitter">
				<Twitter size={20} />
			</a>
		</div>
	</div>
</footer>

<style>
	footer {
		background-color: var(--color-bg-light);
		color: var(--color-text-light);
		padding: var(--spacing-8) 0 var(--spacing-4);
		border-top: 1px solid var(--color-border-light);
		transition:
			background-color 0.3s,
			color 0.3s;
	}
	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		padding: 0 var(--spacing-4);
		gap: var(--spacing-8);
	}
	.project-info h2 {
		font-size: var(--font-size-xl);
		margin-bottom: var(--spacing-2);
		color: var(--color-primary-light);
	}
	.project-info p {
		font-size: var(--font-size-sm);
		color: var(--color-text-light);
	}
	.links {
		display: flex;
		gap: var(--spacing-8);
	}
	.link-group h3 {
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--spacing-2);
		color: var(--color-text-light);
	}
	.link-group a {
		display: block;
		color: var(--color-text-light);
		text-decoration: none;
		transition: color 0.3s;
		font-size: var(--font-size-sm);
		margin-bottom: var(--spacing-2);
	}
	.link-group a:hover {
		color: var(--color-primary-light);
	}
	.bottom-bar {
		max-width: 1200px;
		margin: var(--spacing-8) auto 0;
		padding: var(--spacing-4);
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--color-border-light);
		font-size: var(--font-size-sm);
	}
	.social-links {
		display: flex;
		gap: var(--spacing-4);
	}
	.social-links a {
		color: var(--color-text-light);
		transition: color 0.3s;
	}
	.social-links a:hover {
		color: var(--color-primary-light);
	}
	/* Dark mode styles */
	:global(html[color-scheme='dark']) footer {
		background-color: var(--color-bg-dark);
		color: var(--color-text-dark);
		border-top-color: var(--color-border-dark);
	}
	:global(html[color-scheme='dark']) .project-info h2 {
		color: var(--color-primary-dark);
	}
	:global(html[color-scheme='dark']) .project-info p,
	:global(html[color-scheme='dark']) .link-group h3,
	:global(html[color-scheme='dark']) .link-group a,
	:global(html[color-scheme='dark']) .bottom-bar,
	:global(html[color-scheme='dark']) .social-links a {
		color: var(--color-text-dark);
	}
	:global(html[color-scheme='dark']) .link-group a:hover,
	:global(html[color-scheme='dark']) .social-links a:hover {
		color: var(--color-primary-dark);
	}
	@media (max-width: 768px) {
		.footer-content {
			flex-direction: column;
			gap: var(--spacing-6);
		}
		.links {
			flex-direction: column;
			gap: var(--spacing-6);
		}
		.bottom-bar {
			flex-direction: column;
			gap: var(--spacing-4);
			text-align: center;
		}
	}
</style>
