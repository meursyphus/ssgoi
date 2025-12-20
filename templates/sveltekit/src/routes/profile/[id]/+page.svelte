<script lang="ts">
	import { SsgoiTransition } from '@ssgoi/svelte';
	import { getPost, getRelatedPosts } from '$lib/data/profile';
	import { page } from '$app/stores';

	const postId = $page.params.id;
	const post = getPost(postId);
	const relatedPosts = post ? getRelatedPosts(postId, 3) : [];
</script>

{#if !post}
	<SsgoiTransition id="/profile/{postId}">
		<div class="min-h-screen bg-[#121212] px-4 py-8">
			<p class="text-gray-400">Post not found</p>
		</div>
	</SsgoiTransition>
{:else}
	<SsgoiTransition id="/profile/{postId}">
		<div class="min-h-screen bg-[#121212]">
			<!-- Back button -->
			<div class="px-4 py-4">
				<a
					href="/profile"
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

			<!-- Post content -->
			<div class="px-4 pb-6">
				<!-- Post image with instagram transition -->
				<img
					class="w-full rounded-lg mb-4"
					src={post.coverImage.url}
					alt={post.title}
					style="aspect-ratio: {post.coverImage.aspectRatio}"
					data-instagram-detail-key={post.id}
				/>

				<div>
					<div class="flex items-center gap-3 mb-4 text-xs">
						<span class="px-2 py-0.5 bg-white/5 text-neutral-400 rounded">
							{post.category}
						</span>
						<span class="text-neutral-500">{post.readTime} min read</span>
					</div>

					<h1 class="text-lg font-medium text-white mb-3">{post.title}</h1>
					<p class="text-sm text-neutral-300 mb-6 leading-relaxed">{post.excerpt}</p>

					<!-- Engagement stats -->
					<div class="flex gap-4 mb-6 pb-4 border-b border-white/5">
						<div class="flex items-center gap-1.5 text-neutral-300 text-sm">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
								/>
							</svg>
							<span>{post.likes.toLocaleString()}</span>
						</div>
						<div class="flex items-center gap-1.5 text-neutral-300 text-sm">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
								/>
							</svg>
							<span>{post.comments.toLocaleString()}</span>
						</div>
						<div class="flex items-center gap-1.5 text-neutral-300 text-sm">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<circle cx="18" cy="5" r="3"></circle>
								<circle cx="6" cy="12" r="3"></circle>
								<circle cx="18" cy="19" r="3"></circle>
								<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
								<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
							</svg>
							<span>{post.shares.toLocaleString()}</span>
						</div>
					</div>

					<!-- Post content -->
					<article class="prose prose-invert max-w-none mb-6">
						<p class="text-sm text-neutral-300 leading-relaxed">{post.content}</p>
					</article>

					<!-- Related posts -->
					{#if relatedPosts.length > 0}
						<div class="border-t border-white/5 pt-4">
							<h3 class="text-sm font-medium text-white mb-3">More from this author</h3>
							<div class="space-y-2">
								{#each relatedPosts as relatedPost}
									<a
										href="/profile/{relatedPost.id}"
										class="flex gap-3 p-2 border border-white/5 rounded hover:border-white/10 transition-colors"
									>
										<img
											src={relatedPost.coverImage.url}
											alt={relatedPost.title}
											class="w-16 h-16 rounded object-cover flex-shrink-0"
										/>
										<div class="flex-1 min-w-0">
											<h4 class="text-xs font-medium text-white line-clamp-2">
												{relatedPost.title}
											</h4>
											<div class="flex items-center gap-2 mt-1 text-xs text-neutral-500">
												<span>{relatedPost.category}</span>
												<span>•</span>
												<span>{relatedPost.readTime} min</span>
											</div>
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
