<script lang="ts">
	import { SsgoiTransition } from '@ssgoi/svelte';
	import type { Product } from '$lib/data/products';

	interface Props {
		products: Product[];
		category: string;
	}

	let { products, category }: Props = $props();
</script>

<SsgoiTransition id="/products/{category}">
	<div class="px-4 pb-6 h-full overflow-y-auto">
		{#if products.length === 0}
			<div class="text-center py-12">
				<p class="text-neutral-500 text-sm">No products in this category</p>
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-3">
				{#each products as product (product.id)}
					<div class="block bg-white/5 rounded-xl overflow-hidden">
						<!-- Product Image -->
						<div class="relative aspect-square overflow-hidden">
							<img src={product.image} alt={product.name} class="w-full h-full object-cover" />
							{#if product.badge}
								<span
									class="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium uppercase {product.badge ===
									'sale'
										? 'bg-red-500/90 text-white'
										: product.badge === 'new'
											? 'bg-blue-500/90 text-white'
											: 'bg-amber-500/90 text-black'}"
								>
									{product.badge}
								</span>
							{/if}
						</div>

						<!-- Product Info -->
						<div class="p-3">
							<span class="text-[10px] text-neutral-500 uppercase tracking-wide">
								{product.category}
							</span>
							<h3 class="text-xs font-medium text-white mt-0.5 line-clamp-2 leading-tight">
								{product.name}
							</h3>
							<div class="flex items-baseline gap-1.5 mt-2">
								<span class="text-sm font-semibold text-white">${product.price}</span>
								{#if product.originalPrice}
									<span class="text-[10px] text-neutral-500 line-through">
										${product.originalPrice}
									</span>
								{/if}
							</div>
							<div class="flex items-center gap-1 mt-1.5 text-[10px] text-neutral-400">
								<span class="text-amber-400">★</span>
								<span>{product.rating}</span>
								<span class="text-neutral-600">·</span>
								<span>{product.reviews} reviews</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</SsgoiTransition>
