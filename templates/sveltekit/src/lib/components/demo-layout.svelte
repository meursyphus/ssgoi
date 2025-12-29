<script lang="ts">
	import { Ssgoi } from '@ssgoi/svelte';
	import { drill, pinterest, instagram } from '@ssgoi/svelte/view-transitions';
	import { page } from '$app/stores';
	import NavItem from './nav-item.svelte';

	let { children } = $props();

	const config = {
		experimentalPreserveScroll: true,
		transitions: [
			// Pinterest transitions
			{
				from: '/pinterest/*',
				to: '/pinterest',
				transition: pinterest(),
				symmetric: true
			},
			// Posts transitions - drill effect
			{
				from: '/posts',
				to: '/posts/*',
				transition: drill({ direction: 'enter' })
			},
			{
				from: '/posts/*',
				to: '/posts',
				transition: drill({ direction: 'exit' })
			},
			// Profile transitions - instagram
			{
				from: '/profile',
				to: '/profile/*',
				transition: instagram(),
				symmetric: true
			}
		]
	};
</script>

<div class="h-full bg-[#121212] flex z-0">
	<!-- Mobile Frame -->
	<div class="w-full bg-[#121212] flex flex-col overflow-hidden relative">
		<!-- Main Content Area -->
		<main
			id="demo-content"
			class="flex-1 w-full overflow-y-scroll overflow-x-hidden relative z-0 bg-[#121212] scrollbar-hide"
		>
			<Ssgoi {config}>
				{@render children()}
			</Ssgoi>
		</main>

		<!-- Bottom Navigation -->
		<nav
			class="flex justify-around items-center bg-[#121212] border-t border-white/5 py-2 flex-shrink-0"
		>
			<NavItem
				href="/posts"
				label="Posts"
				isActive={$page.url.pathname.startsWith('/posts')}
			>
				{#snippet icon()}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
					</svg>
				{/snippet}
			</NavItem>
			<NavItem
				href="/products"
				label="Shop"
				isActive={$page.url.pathname.startsWith('/products')}
			>
				{#snippet icon()}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="9" cy="21" r="1"></circle>
						<circle cx="20" cy="21" r="1"></circle>
						<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
					</svg>
				{/snippet}
			</NavItem>
			<NavItem
				href="/pinterest"
				label="Gallery"
				isActive={$page.url.pathname.startsWith('/pinterest')}
			>
				{#snippet icon()}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="3" width="7" height="7"></rect>
						<rect x="14" y="3" width="7" height="7"></rect>
						<rect x="14" y="14" width="7" height="7"></rect>
						<rect x="3" y="14" width="7" height="7"></rect>
					</svg>
				{/snippet}
			</NavItem>
			<NavItem
				href="/profile"
				label="Profile"
				isActive={$page.url.pathname.startsWith('/profile')}
			>
				{#snippet icon()}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
				{/snippet}
			</NavItem>
		</nav>
	</div>
</div>
