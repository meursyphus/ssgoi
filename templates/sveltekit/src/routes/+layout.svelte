<script lang="ts">
	import '../app.css';
	import DemoWrapper from '$lib/components/demo-wrapper.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>SSGOI Demo - SvelteKit Template</title>
	<meta name="description" content="A demo showcasing SSGOI page transitions in SvelteKit" />
</svelte:head>

<DemoWrapper>
	{@render children()}
</DemoWrapper>
