<script lang="ts">
	import { SsgoiTransition } from '@ssgoi/svelte';
	import { getPost, getRelatedPosts } from '$lib/data/posts';
	import { page } from '$app/stores';

	const postId = $page.params.id;
	const post = getPost(postId);
	const relatedPosts = post ? getRelatedPosts(postId, 3) : [];

	// Simple markdown renderer for basic formatting
	function renderMarkdown(content: string) {
		return content
			.replace(/^# (.*$)/gim, '<h1 class="text-lg font-medium text-white mb-4 mt-6">$1</h1>')
			.replace(/^## (.*$)/gim, '<h2 class="text-base font-medium text-white mb-3 mt-5">$1</h2>')
			.replace(/^### (.*$)/gim, '<h3 class="text-sm font-medium text-white mb-2 mt-4">$1</h3>')
			.replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-white">$1</strong>')
			.replace(/\*(.*?)\*/g, '<em class="italic text-neutral-300">$1</em>')
			.replace(/^- (.*$)/gim, '<li class="text-neutral-300 text-xs">$1</li>')
			.replace(/\n\n/g, '</p><p class="text-xs text-neutral-300 mb-4 leading-relaxed">')
			.replace(/^(?!<[hl])/gim, '<p class="text-xs text-neutral-300 mb-4 leading-relaxed">')
			.replace(/$(?!<\/[hl])/gim, '</p>');
	}
</script>

{#if !post}
	<SsgoiTransition id="/posts/{postId}">
		<div class="min-h-screen bg-[#121212] px-4 py-8">
			<p class="text-gray-400">Post not found</p>
		</div>
	</SsgoiTransition>
{:else}
	<SsgoiTransition id="/posts/{postId}">
		<div class="min-h-screen bg-[#121212]">
			<!-- Back button -->
			<div class="px-4 py-4">
				<a
					href="/posts"
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

			<!-- Post header -->
			<div class="px-4 pb-6">
				<div class="flex items-center gap-3 mb-4 text-xs">
					<span class="px-2 py-0.5 bg-white/5 text-neutral-400 rounded">
						{post.category}
					</span>
					<span class="text-neutral-500">{post.readTime} min read</span>
				</div>

				<h1 class="text-xl font-medium text-white mb-3">{post.title}</h1>
				<p class="text-sm text-neutral-400 mb-6">{post.excerpt}</p>

				<!-- Author info -->
				<div class="flex items-center gap-3">
					<img
						src={post.author.avatar}
						alt={post.author.name}
						class="w-8 h-8 rounded-full"
					/>
					<div>
						<div class="text-xs font-medium text-white">{post.author.name}</div>
						<div class="text-xs text-neutral-500">{post.author.role}</div>
						<div class="text-xs text-neutral-600">
							{new Date(post.publishedAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</div>
					</div>
				</div>
			</div>

			<!-- Hero image -->
			<img src={post.coverImage} alt={post.title} class="w-full h-48 object-cover" />

			<!-- Post content -->
			<article class="px-4 py-6 prose prose-invert max-w-none">
				{@html renderMarkdown(post.content)}
			</article>

			<!-- Tags -->
			<div class="px-4 pb-6">
				<div class="flex flex-wrap gap-1.5">
					{#each post.tags as tag}
						<span class="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
							#{tag}
						</span>
					{/each}
				</div>
			</div>

			<!-- Related posts -->
			{#if relatedPosts.length > 0}
				<div class="border-t border-white/5 px-4 py-6">
					<h3 class="text-sm font-medium text-white mb-3">More to Read</h3>
					<div class="space-y-2">
						{#each relatedPosts as relatedPost}
							<a
								href="/posts/{relatedPost.id}"
								class="flex gap-3 p-2 border border-white/5 rounded hover:border-white/10 transition-colors"
							>
								<img
									src={relatedPost.coverImage}
									alt={relatedPost.title}
									class="w-12 h-12 rounded object-cover flex-shrink-0"
								/>
								<div class="flex-1">
									<h4 class="text-xs font-medium text-white line-clamp-2">
										{relatedPost.title}
									</h4>
									<p class="text-xs text-neutral-500 mt-0.5">
										{relatedPost.readTime} min read
									</p>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</SsgoiTransition>
{/if}
