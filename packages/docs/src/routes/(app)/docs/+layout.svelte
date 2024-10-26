<script lang="ts">
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';
	import { normalizePath } from '$lib/utils';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();



	function getGroupOrder(group: string) {
		const groupOrder = {
			'Getting Started': 1,
			Advanced: 2,
			Reference: 3,
			Community: 4
		};
		return groupOrder[group as keyof typeof groupOrder] || 99;
	}

	let isSidebarOpen = $state(false);

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}
	let navigation = $derived(data.posts.reduce(
		(acc, post) => {
			const group = acc.find((g) => g.name === post.group);
			if (!group) {
				acc.push({
					name: post.group,
					order: getGroupOrder(post.group),
					items: [
						{
							url: `/docs/${post.slug}`,
							title: post.title,
							order: post.order
						}
					]
				});
			} else {
				group.items.push({
					url: `/docs/${post.slug}`,
					title: post.title,
					order: post.order
				});
			}
			return acc;
		},
		[] as { name: string; order: number; items: { url: string; title: string; order: number }[] }[]
	));
	run(() => {
		navigation.sort((a, b) => a.order - b.order);
		navigation.forEach((group) => {
			group.items.sort((a, b) => a.order - b.order);
		});
	});
</script>

<div class="docs-layout">
	<button class="sidebar-toggle" onclick={toggleSidebar} aria-label="Toggle sidebar">
		{isSidebarOpen ? '✕' : '☰'}
	</button>
	<nav class:open={isSidebarOpen}>
		{#each navigation as group}
			<div class="group">
				<h3>{group.name}</h3>
				<ul>
					{#each group.items as item}
						<li>
							<a
								href={item.url}
								class:active={normalizePath($page.url.pathname) === normalizePath(item.url)}
							>
								{item.title}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>
	<main in:fly={{ y: 20, duration: 300 }}>
		{@render children?.()}
	</main>
</div>

<style>
	.docs-layout {
		display: flex;
		min-height: calc(100vh - var(--header-height));
	}
	nav {
		width: 280px;
		padding: var(--spacing-6) var(--spacing-4);
		overflow-y: auto;
		background-color: var(--color-bg-light);
		border-right: 1px solid var(--color-border-light);
		transition: transform 0.3s ease-in-out;
	}
	.group {
		margin-bottom: var(--spacing-6);
	}
	h3 {
		font-size: var(--font-size-lg);
		font-weight: bold;
		margin-bottom: var(--spacing-3);
		color: var(--color-primary-light);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
	li {
		margin-bottom: var(--spacing-2);
		padding-left: var(--spacing-3);
		border-left: 2px solid transparent;
	}
	a {
		display: block;
		text-decoration: none;
		color: var(--color-text-light);
		transition:
			color 0.3s,
			border-color 0.3s;
		padding: var(--spacing-2) 0;
		font-size: var(--font-size-sm);
	}
	a:hover,
	a.active {
		color: var(--color-primary-light);
	}
	a.active {
		font-weight: bold;
	}
	li:has(a.active) {
		border-left-color: var(--color-primary-light);
	}
	main {
		flex-grow: 1;
		padding: var(--spacing-6);
		overflow-y: auto;
	}
	.sidebar-toggle {
		display: none;
	}
	/* Dark mode styles */
	:global(html[color-scheme='dark']) nav {
		background-color: var(--color-bg-dark);
		border-right-color: var(--color-border-dark);
	}
	:global(html[color-scheme='dark']) h3 {
		color: var(--color-primary-dark);
	}
	:global(html[color-scheme='dark']) a {
		color: var(--color-text-dark);
	}
	:global(html[color-scheme='dark']) a:hover,
	:global(html[color-scheme='dark']) a.active {
		color: var(--color-primary-dark);
	}
	:global(html[color-scheme='dark']) li:has(a.active) {
		border-left-color: var(--color-primary-dark);
	}
	@media (max-width: 768px) {
		nav {
			position: fixed;
			top: var(--header-height);
			left: 0;
			bottom: 0;
			transform: translateX(-100%);
			z-index: 1000;
		}
		nav.open {
			transform: translateX(0);
		}
		.sidebar-toggle {
			display: block;
			position: fixed;
			top: calc(var(--header-height) + var(--spacing-4));
			left: var(--spacing-4);
			z-index: 1001;
			background-color: var(--color-primary-light);
			color: white;
			border: none;
			border-radius: var(--radius-full);
			width: 40px;
			height: 40px;
			font-size: var(--font-size-xl);
			cursor: pointer;
			transition: background-color 0.3s;
		}
		:global(html[color-scheme='dark']) .sidebar-toggle {
			background-color: var(--color-primary-dark);
		}
	}
</style>
