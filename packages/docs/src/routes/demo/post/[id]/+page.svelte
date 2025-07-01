<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import { marked } from 'marked';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	$: htmlContent = marked(data.post.content);
</script>

<PageTransition>
	<div class="post-detail">
		<!-- Back button -->
		<a href="/demo/post" class="back-button">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
			<span>Back</span>
		</a>

		<!-- Post header -->
		<div class="post-header">
			<div class="post-meta">
				<span class="category">{data.post.category}</span>
				<span class="read-time">{data.post.readTime} min read</span>
			</div>
			<h1>{data.post.title}</h1>
			<p class="excerpt">{data.post.excerpt}</p>
			
			<div class="author-info">
				<img src={data.post.author.avatar} alt={data.post.author.name} />
				<div>
					<div class="author-name">{data.post.author.name}</div>
					<div class="author-role">{data.post.author.role}</div>
					<div class="publish-date">{new Date(data.post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
				</div>
			</div>
		</div>

		<!-- Hero image -->
		<img class="hero-image" src={data.post.coverImage} alt={data.post.title} />

		<!-- Post content -->
		<article class="post-content">
			{@html htmlContent}
		</article>

		<!-- Tags -->
		<div class="tags">
			{#each data.post.tags as tag}
				<span class="tag">#{tag}</span>
			{/each}
		</div>

		<!-- Related posts -->
		{#if data.relatedPosts.length > 0}
			<div class="related-posts">
				<h3>More to Read</h3>
				<div class="related-grid">
					{#each data.relatedPosts as post}
						<a href="/demo/post/{post.id}" class="related-card">
							<img class="related-image" src={post.coverImage} alt={post.title} />
							<div class="related-content">
								<h4>{post.title}</h4>
								<p>{post.readTime} min read</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</PageTransition>

<style>
	.post-detail {
		padding: 1rem 0 3rem;
		padding-inline: 16px;
		position: relative;
		background: white;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #666;
		text-decoration: none;
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
		transition: color 0.2s ease;
	}

	.back-button:hover {
		color: #333;
	}

	.post-header {
		margin-bottom: 2rem;
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.category {
		background: #f5f5f5;
		padding: 0.25rem 0.75rem;
		border-radius: 16px;
		font-weight: 500;
	}

	.read-time {
		color: #666;
	}

	h1 {
		font-size: 2rem;
		font-weight: 800;
		line-height: 1.2;
		margin-bottom: 1rem;
		color: #1a1a1a;
	}

	.excerpt {
		font-size: 1.125rem;
		color: #666;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.author-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.author-info img {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
	}

	.author-name {
		font-weight: 600;
		font-size: 0.95rem;
	}

	.author-role {
		font-size: 0.875rem;
		color: #666;
	}

	.publish-date {
		font-size: 0.75rem;
		color: #999;
	}

	.hero-image {
		width: calc(100% + 32px);
		height: 200px;
		margin: 2rem -16px;
		border-radius: 12px;
		object-fit: cover;
		background-color: #f0f0f0;
	}

	.post-content {
		margin-bottom: 3rem;
	}

	/* Markdown styles */
	.post-content :global(h1),
	.post-content :global(h2),
	.post-content :global(h3) {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-weight: 700;
	}

	.post-content :global(h1) {
		font-size: 1.75rem;
	}

	.post-content :global(h2) {
		font-size: 1.5rem;
	}

	.post-content :global(h3) {
		font-size: 1.25rem;
	}

	.post-content :global(p) {
		margin-bottom: 1.5rem;
		line-height: 1.7;
		color: #333;
	}

	.post-content :global(ul),
	.post-content :global(ol) {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}

	.post-content :global(li) {
		margin-bottom: 0.5rem;
		line-height: 1.7;
	}

	.post-content :global(code) {
		background: #f5f5f5;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.875em;
		font-family: var(--font-mono);
	}

	.post-content :global(pre) {
		background: #1a1a1a;
		color: #fff;
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
		margin-bottom: 1.5rem;
	}

	.post-content :global(pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}

	.post-content :global(blockquote) {
		border-left: 4px solid #e5e5e5;
		padding-left: 1rem;
		margin: 1.5rem 0;
		color: #666;
		font-style: italic;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 3rem;
	}

	.tag {
		font-size: 0.875rem;
		color: #666;
		background: #f5f5f5;
		padding: 0.375rem 0.75rem;
		border-radius: 16px;
	}

	.related-posts {
		border-top: 1px solid #eee;
		padding-top: 2rem;
	}

	.related-posts h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}

	.related-grid {
		display: grid;
		gap: 1rem;
	}

	.related-card {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		background: #f9f9f9;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition: background 0.2s ease;
	}

	.related-card:hover {
		background: #f0f0f0;
	}

	.related-image {
		width: 60px;
		height: 60px;
		border-radius: 6px;
		flex-shrink: 0;
		object-fit: cover;
		background-color: #f0f0f0;
	}

	.related-content h4 {
		font-size: 0.95rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
		line-height: 1.3;
	}

	.related-content p {
		font-size: 0.75rem;
		color: #666;
	}
</style>