<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<PageTransition>
	<div class="posts-container">
		<h1>Latest Posts</h1>
		<p class="subtitle">Insights on Svelte, Flutter, and web development</p>
		
		<div class="posts-grid">
			{#each data.posts as post}
				<a href="/demo/post/{post.id}" class="post-card">
					<img class="post-image" src={post.coverImage} alt={post.title} />
					<div class="post-content">
						<div class="post-meta">
							<span class="category">{post.category}</span>
							<span class="read-time">{post.readTime} min read</span>
						</div>
						<h2>{post.title}</h2>
						<p>{post.excerpt}</p>
						<div class="post-footer">
							<div class="author">
								<img src={post.author.avatar} alt={post.author.name} />
								<div>
									<span class="author-name">{post.author.name}</span>
									<span class="publish-date">{new Date(post.publishedAt).toLocaleDateString()}</span>
								</div>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</PageTransition>

<style>
	.posts-container {
		padding: 2rem 0;
		padding-inline: 16px;
		min-height: calc(100vh - 200px);
		background: white;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
		margin-bottom: 2rem;
	}

	.posts-grid {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.post-card {
		display: block;
		background: white;
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		border: 1px solid #eee;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.post-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		border-color: #ddd;
	}

	.post-image {
		height: 160px;
		width: 100%;
		object-fit: cover;
		background-color: #f0f0f0;
	}

	.post-content {
		padding: 1.5rem;
	}

	.post-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
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

	.post-card h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		line-height: 1.3;
	}

	.post-card p {
		color: #666;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		font-size: 0.95rem;
	}

	.post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.author {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.author img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.author div {
		display: flex;
		flex-direction: column;
	}

	.author-name {
		font-weight: 500;
		font-size: 0.875rem;
	}

	.publish-date {
		font-size: 0.75rem;
		color: #999;
	}
</style>