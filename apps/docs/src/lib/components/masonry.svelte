<script lang="ts">
	import { run } from 'svelte/legacy';

	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	
	// On non-primitive types, we need a property to tell masonry items apart. This component
	


	type Item = $$Generic;
	interface Props {
		animate?: boolean;
		calcCols?: any;
		columnClass?: string;
		duration?: number;
		gap?: number;
		// hard-codes the name of this property to 'id'. See https://svelte.dev/tutorial/keyed-each-blocks.
		getId?: any;
		idKey?: string;
		items: Item[];
		masonryHeight?: number;
		masonryWidth?: number;
		maxColWidth?: number;
		minColWidth?: number;
		style?: string;
		class?: any;
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		animate = true,
		calcCols = (masonryWidth: number, minColWidth: number, gap: number): number => {
		return Math.min(items.length, Math.floor((masonryWidth + gap) / (minColWidth + gap)) || 1);
	},
		columnClass = ``,
		duration = 200,
		gap = 20,
		getId = (item: Item): string | number => {
		if (typeof item === `number`) return item;
		if (typeof item === `string`) return item;
		return (item as Record<string, string | number>)[idKey];
	},
		idKey = `id`,
		items,
		masonryHeight = $bindable(0),
		masonryWidth = $bindable(0),
		maxColWidth = 500,
		minColWidth = 330,
		style = ``,
		class: className = ``,
		children
	}: Props = $props();

	run(() => {
		if (maxColWidth < minColWidth) {
			console.warn(`svelte-bricks: maxColWidth (${maxColWidth}) < minColWidth (${minColWidth}).`);
		}
	});
	let nCols = $derived(calcCols(masonryWidth, minColWidth, gap));
	let itemsToCols = $derived(items.reduce(
		(cols: [Item, number][][], item, idx) => {
			cols[idx % cols.length].push([item, idx]);
			return cols;
		},
		Array(nCols).fill(null).map(() => []) // prettier-ignore
	));
</script>

<div
	class="masonry {className}"
	bind:clientWidth={masonryWidth}
	bind:clientHeight={masonryHeight}
	style="gap: {gap}px; {style}"
>
	{#each itemsToCols as col}
		<div class="col {columnClass}" style="gap: {gap}px; max-width: {maxColWidth}px;">
			{#if animate}
				{#each col as [item, idx] (getId(item))}
					<div
						in:fade={{ delay: 100, duration }}
						out:fade={{ delay: 0, duration }}
						animate:flip={{ duration }}
					>
						{#if children}{@render children({ idx, item, })}{:else}
							<span>{item}</span>
						{/if}
					</div>
				{/each}
			{:else}
				{#each col as [item, idx] (getId(item))}
					{#if children}{@render children({ idx, item, })}{:else}
						<span>{item}</span>
					{/if}
				{/each}
			{/if}
		</div>
	{/each}
</div>

<style>
	:where(div.masonry) {
		display: flex;
		justify-content: center;
		overflow-wrap: anywhere;
		box-sizing: border-box;
	}
	:where(div.masonry div.col) {
		display: grid;
		height: max-content;
		width: 100%;
	}
</style>
