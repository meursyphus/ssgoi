<script lang="ts">
	import { Ssgoi } from '@ssgoi/svelte';
	import { drill, pinterest, instagram } from '@ssgoi/svelte/view-transitions';
	import { page } from '$app/stores';

	let { children } = $props();

	let mainElement: HTMLElement | null = $state(null);
	let scrollPositions: Record<string, number> = {};
	let previousPath = $state($page.url.pathname);

	const config = {
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

	$effect(() => {
		const pathname = $page.url.pathname;
		if (mainElement && previousPath !== pathname) {
			// Save current scroll position
			scrollPositions[previousPath] = mainElement.scrollTop;

			// Restore scroll position for new page
			const savedPosition = scrollPositions[pathname] || 0;
			mainElement.scrollTop = savedPosition;

			previousPath = pathname;
		}
	});

	function handleScroll() {
		if (mainElement) {
			scrollPositions[$page.url.pathname] = mainElement.scrollTop;
		}
	}
</script>

<div class="h-full bg-[#121212] flex z-0">
	<!-- Mobile Frame -->
	<div class="w-full bg-[#121212] flex flex-col overflow-hidden relative">
		<!-- Main Content Area -->
		<main
			bind:this={mainElement}
			onscroll={handleScroll}
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
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
					<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
				</svg>
			</NavItem>
			<NavItem
				href="/products"
				label="Shop"
				isActive={$page.url.pathname.startsWith('/products')}
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<circle cx="9" cy="21" r="1"></circle>
					<circle cx="20" cy="21" r="1"></circle>
					<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
				</svg>
			</NavItem>
			<NavItem
				href="/pinterest"
				label="Gallery"
				isActive={$page.url.pathname.startsWith('/pinterest')}
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<rect x="3" y="3" width="7" height="7"></rect>
					<rect x="14" y="3" width="7" height="7"></rect>
					<rect x="14" y="14" width="7" height="7"></rect>
					<rect x="3" y="14" width="7" height="7"></rect>
				</svg>
			</NavItem>
			<NavItem
				href="/profile"
				label="Profile"
				isActive={$page.url.pathname.startsWith('/profile')}
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
					<circle cx="12" cy="7" r="4"></circle>
				</svg>
			</NavItem>
		</nav>
	</div>
</div>

{#snippet NavItem({ href, label, isActive, children }: { href: string; label: string; isActive: boolean; children: any })}
	<a
		{href}
		class="flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200 {isActive
			? 'text-white'
			: 'text-neutral-500 hover:text-neutral-400'}"
	>
		<div class="w-5 h-5">
			{@render children()}
		</div>
		<span>{label}</span>
	</a>
{/snippet}
