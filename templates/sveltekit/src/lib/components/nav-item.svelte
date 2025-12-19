<script lang="ts">
	import type { Snippet } from 'svelte';

	let { href, label, isActive, icon }: { href: string; label: string; isActive: boolean; icon: Snippet } = $props();
</script>

<a
	{href}
	class="flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200 {isActive
		? 'text-white'
		: 'text-neutral-500 hover:text-neutral-400'}"
>
	<div class="w-5 h-5">
		{@render icon()}
	</div>
	<span>{label}</span>
</a>
