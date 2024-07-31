<script lang="ts">
	import Toggle from './toggle.svelte';
</script>

<header class="bg-background px-4 lg:px-6 h-14 flex items-center justify-between">
	<a href="/" class="flex items-center">
		<span class="text-2xl font-bold text-primary">SSGOI</span>
	</a>
	<nav class="hidden lg:flex gap-4 sm:gap-6">
		<a
			href="/docs"
			class="text-sm font-medium hover:underline underline-offset-4 text-primary-foreground"
		>
			Docs
		</a>
		<a
			href="/rss.xml"
			target="_blank"
			class="text-sm font-medium hover:underline underline-offset-4 text-primary-foreground"
		>
			RSS
		</a>
	</nav>
	<Toggle />
</header>

<style>
	nav {
		padding-block: var(--size-7);
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	@media (min-width: 768px) {
		nav {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
