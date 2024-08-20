<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	export let key: string;
	import { getRootRect } from '../../utils/index.js';
	import './pinterest-context.js';
	import context from './pinterest-context.js';

	let containerEl: HTMLElement;

	function setRect(
		key: string,
		rect: { x: number; y: number; width: number; height: number },
		type: 'in' | 'out'
	) {
		const info = context.get(key) ?? {};
		const rootRect = getRootRect();
		info[type] = {
			...rect,
			x: rect.x - rootRect.x,
			y: rect.y - rootRect.y
		};

		context.set(key, info);
	}

	onMount(() => {
		const rect = containerEl.getBoundingClientRect();
		setRect(key, rect, 'in');

		const observer = new ResizeObserver(([entry]) => {
			const rect = entry.contentRect;
			setRect(key, rect, 'in');
		});

		observer.observe(containerEl);

		return () => {
			const rect = containerEl.getBoundingClientRect();
			setRect(key, rect, 'out');
			observer.disconnect();
		};
	});
</script>

<div bind:this={containerEl} style="width: fit-content; height: fit-content;">
	<slot />
</div>
