<script lang="ts">
	import { SsgoiTransition } from '@ssgoi/svelte';
	import { pinterestItems } from '$lib/data/pinterest';

	// Split items into two columns for masonry effect
	const leftColumnItems = pinterestItems.filter((_, index) => index % 2 === 0);
	const rightColumnItems = pinterestItems.filter((_, index) => index % 2 === 1);
</script>

<SsgoiTransition id="/pinterest">
	<div class="min-h-screen bg-[#121212] px-4 py-6">
		<!-- Header -->
		<div class="mb-6">
			<h1 class="text-sm font-medium text-white mb-1">Gallery</h1>
			<p class="text-xs text-neutral-500">Explore inspiring ideas and creativity</p>
		</div>

		<!-- Masonry Grid -->
		<div class="grid grid-cols-2 gap-2">
			<!-- Left Column -->
			<div class="flex flex-col gap-2">
				{#each leftColumnItems as item (item.id)}
					<a
						href="/pinterest/{item.id}"
						class="block border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/10 group"
					>
						<!-- Image with dynamic aspect ratio -->
						<div class="relative" style="aspect-ratio: {item.aspectRatio}">
							<img
								src={item.image}
								alt={item.title}
								class="w-full h-full object-cover bg-[#111]"
								data-pinterest-gallery-key={item.id}
							/>
							<!-- Overlay on hover -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
							></div>

							<!-- Save button -->
							<button
								class="absolute top-2 right-2 bg-white/10 text-white px-2 py-0.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20"
							>
								Save
							</button>
						</div>

						<!-- Content -->
						<div class="p-2.5">
							<h3 class="font-medium text-white text-xs mb-1.5 line-clamp-2">
								{item.title}
							</h3>

							<!-- Author info -->
							<div class="flex items-center gap-1.5 mb-2">
								<img
									src={item.author.avatar}
									alt={item.author.name}
									class="w-4 h-4 rounded-full"
								/>
								<span class="text-xs text-neutral-400">{item.author.name}</span>
							</div>

							<!-- Stats and Category -->
							<div class="flex items-center justify-between text-xs">
								<span class="text-neutral-500">{item.saves.toLocaleString()} saves</span>
								<span class="px-1.5 py-0.5 bg-white/5 text-neutral-400 rounded">
									{item.category}
								</span>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Right Column -->
			<div class="flex flex-col gap-2">
				{#each rightColumnItems as item (item.id)}
					<a
						href="/pinterest/{item.id}"
						class="block border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/10 group"
					>
						<!-- Image with dynamic aspect ratio -->
						<div class="relative" style="aspect-ratio: {item.aspectRatio}">
							<img
								src={item.image}
								alt={item.title}
								class="w-full h-full object-cover bg-[#111]"
								data-pinterest-gallery-key={item.id}
							/>
							<!-- Overlay on hover -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
							></div>

							<!-- Save button -->
							<button
								class="absolute top-2 right-2 bg-white/10 text-white px-2 py-0.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20"
							>
								Save
							</button>
						</div>

						<!-- Content -->
						<div class="p-2.5">
							<h3 class="font-medium text-white text-xs mb-1.5 line-clamp-2">
								{item.title}
							</h3>

							<!-- Author info -->
							<div class="flex items-center gap-1.5 mb-2">
								<img
									src={item.author.avatar}
									alt={item.author.name}
									class="w-4 h-4 rounded-full"
								/>
								<span class="text-xs text-neutral-400">{item.author.name}</span>
							</div>

							<!-- Stats and Category -->
							<div class="flex items-center justify-between text-xs">
								<span class="text-neutral-500">{item.saves.toLocaleString()} saves</span>
								<span class="px-1.5 py-0.5 bg-white/5 text-neutral-400 rounded">
									{item.category}
								</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</SsgoiTransition>
