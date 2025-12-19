<script lang="ts">
	import { SsgoiTransition } from '@ssgoi/svelte';
	import { getPinterestItem, getRelatedPins } from '$lib/data/pinterest';
	import { page } from '$app/stores';

	const pinId = $page.params.id;
	const item = getPinterestItem(pinId);
	const relatedPins = item ? getRelatedPins(pinId, 6) : [];
</script>

{#if !item}
	<SsgoiTransition id="/pinterest/{pinId}">
		<div class="min-h-screen bg-[#121212] px-4 py-8">
			<p class="text-gray-400">Pin not found</p>
		</div>
	</SsgoiTransition>
{:else}
	<SsgoiTransition id="/pinterest/{pinId}">
		<div class="min-h-screen bg-[#121212]">
			<!-- Back button -->
			<div class="px-4 py-4">
				<a
					href="/pinterest"
					class="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					<span>Back</span>
				</a>
			</div>

			<!-- Pin content -->
			<div class="px-4 pb-6">
				<!-- Pin image with hero transition -->
				<img
					class="w-full rounded-lg mb-4"
					src={item.image}
					alt={item.title}
					style="aspect-ratio: {item.aspectRatio}"
					data-pinterest-detail-key={item.id}
				/>

				<div>
					<h1 class="text-base font-medium text-white mb-3">{item.title}</h1>
					<p class="text-xs text-neutral-300 mb-4 leading-relaxed">{item.content}</p>

					<!-- Category and saves -->
					<div class="flex justify-between items-center mb-3">
						<span class="px-2 py-0.5 bg-white/5 text-neutral-400 rounded text-xs">
							{item.category}
						</span>
						<span class="text-neutral-500 text-xs">
							{item.saves.toLocaleString()} saves
						</span>
					</div>

					<!-- Tags -->
					<div class="flex flex-wrap gap-1.5 mb-6">
						{#each item.tags as tag}
							<span class="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
								#{tag}
							</span>
						{/each}
					</div>

					<!-- Ingredients/Materials/Steps -->
					{#if item.ingredients}
						<div class="mb-6">
							<h3 class="text-sm font-medium text-white mb-2">Ingredients</h3>
							<ul class="space-y-1">
								{#each item.ingredients as ingredient}
									<li class="flex items-start gap-2 text-neutral-300 text-xs">
										<span class="text-neutral-500">•</span>
										<span>{ingredient}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if item.materials}
						<div class="mb-6">
							<h3 class="text-sm font-medium text-white mb-2">Materials</h3>
							<ul class="space-y-1">
								{#each item.materials as material}
									<li class="flex items-start gap-2 text-neutral-300 text-xs">
										<span class="text-neutral-500">•</span>
										<span>{material}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if item.steps}
						<div class="mb-6">
							<h3 class="text-sm font-medium text-white mb-2">Steps</h3>
							<ol class="space-y-2">
								{#each item.steps as step, index}
									<li class="flex items-start gap-2 text-neutral-300 text-xs">
										<span class="text-neutral-500 font-medium">{index + 1}.</span>
										<span>{step}</span>
									</li>
								{/each}
							</ol>
						</div>
					{/if}

					<!-- Author Info -->
					<div class="border-t border-white/5 pt-4 mb-6">
						<div class="flex items-center gap-3">
							<img src={item.author.avatar} alt={item.author.name} class="w-10 h-10 rounded-full" />
							<div class="flex-1">
								<div class="text-xs font-medium text-white">{item.author.name}</div>
								<div class="text-xs text-neutral-500">
									{item.author.followers.toLocaleString()} followers
								</div>
								<div class="text-xs text-neutral-400">{item.author.bio}</div>
							</div>
							<button
								class="px-3 py-1.5 bg-white text-black rounded-full text-xs font-medium hover:bg-neutral-200 transition-colors"
							>
								Follow
							</button>
						</div>
					</div>

					<!-- Related Pins -->
					{#if relatedPins.length > 0}
						<div class="border-t border-white/5 pt-4">
							<h3 class="text-sm font-medium text-white mb-3">More like this</h3>
							<div class="grid grid-cols-2 gap-2">
								{#each relatedPins as relatedPin}
									<a
										href="/pinterest/{relatedPin.id}"
										class="block border border-white/5 rounded-lg overflow-hidden hover:border-white/10 transition-colors"
									>
										<div class="relative" style="aspect-ratio: {relatedPin.aspectRatio}">
											<img
												src={relatedPin.image}
												alt={relatedPin.title}
												class="w-full h-full object-cover"
											/>
										</div>
										<div class="p-2">
											<h4 class="text-xs font-medium text-white line-clamp-2">
												{relatedPin.title}
											</h4>
										</div>
									</a>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</SsgoiTransition>
{/if}
