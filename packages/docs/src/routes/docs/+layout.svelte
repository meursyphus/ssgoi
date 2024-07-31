<script lang="ts">
	import { page } from '$app/stores';
	import { normalizePath } from '$lib/utils';
	import type { PageData } from '../$types';

	export let data: PageData;

	$: navigation = data.posts.reduce(
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
	);

	$: {
		navigation.sort((a, b) => a.order - b.order);
		navigation.forEach((group) => {
			group.items.sort((a, b) => a.order - b.order);
		});
	}

	function getGroupOrder(group: string) {
		const groupOrder = {
			'Getting Started': 1,
			Advanced: 2,
			Reference: 3,
			Community: 4
		};
		return groupOrder[group as keyof typeof groupOrder] || 99;
	}
</script>

<div class="layout">
	<nav>
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
	<main>
		<slot />
	</main>
</div>

<style>
	.layout {
		display: flex;
		height: 100vh;
	}

	nav {
		width: 250px;
		padding: 20px;
		overflow-y: auto;
		border-right: 1px solid #eee;
	}

	.group {
		margin-bottom: 20px;
	}

	h3 {
		font-size: 1.2em;
		font-weight: bold;
		margin-bottom: 10px;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin-bottom: 5px;
	}

	a {
		text-decoration: none;
		color: #333;
	}

	a.active {
		font-weight: bold;
		color: #0066cc;
	}

	main {
		flex-grow: 1;
		padding: 20px;
		overflow-y: auto;
	}

	main::-webkit-scrollbar {
		width: 5px;
	}

	main::-webkit-scrollbar-track {
		background: var(--surface-1);
	}

	main::-webkit-scrollbar-thumb {
		background: var(--surface-3);
		border-radius: 5px;
	}

	main::-webkit-scrollbar-thumb:hover {
		background: var(--surface-4);
	}

	main {
		scrollbar-width: thin;
		scrollbar-color: var(--surface-3) var(--surface-1);
	}
</style>
