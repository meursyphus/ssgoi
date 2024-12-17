<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';

	import { POSTS } from '../blog-mock';

	const slug = $page.params.detail;

	const post = POSTS.find((p) => p.name.toLocaleLowerCase() === slug);
</script>

<PageTransition class="post-page=detail">
	{#if post}
		<div class="posts-container" data-hero-key={slug} data-pinterest-key={slug}>
			<img class="cover-image" src={post.coverImage} alt={post.name} />

			<header>
				<h1>{post.name}</h1>
				<div class="post-meta">
					<div class="author-info">
						<span class="author-avatar" />
						<span class="author-name">{post.author}</span>
					</div>
					<time datetime={post.date}>{post.date}</time>
				</div>
			</header>

			<article class="post" in:fade={{ duration: 300, delay: 150 }}>
				<div class="content">
					<p>{post.description}</p>
				</div>

				<div class="tags">
					{#each post.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			</article>
		</div>
	{:else}
		<div class="error">Post not found</div>
	{/if}
</PageTransition>

<style>
	:global(.post-page-detail) {
		background: white;
	}

	.posts-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 4rem 2rem;
		height: 100vh;
	}

	.cover-image {
		width: 1200px;
		height: 300px;
		object-fit: cover;
		transition: all 0.3s ease;
		border-radius: 12px;
	}

	header {
		margin-bottom: 4rem;
		position: relative;
	}

	.post {
		background-color: white;
		border-radius: 12px;
		transition: all 0.3s ease;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.tag {
		background-color: #f7f3ee;
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.02em;
	}

	h1 {
		font-size: 1.75rem;
		margin-bottom: 1.5rem;
		font-weight: 500;
		line-height: 1.3;
	}

	.post-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.author-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.author-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #e0f0ff;
		display: block;
	}

	.author-name {
		color: #1b315e;
		font-weight: 500;
		font-size: 0.875rem;
	}

	time {
		color: #666;
		font-size: 0.875rem;
	}

	.content {
		color: #2c2c2c;
		line-height: 1.8;
		opacity: 0.9;
	}

	.content p {
		margin-bottom: 1rem;
	}

	:global(.post-page) {
		background: white;
	}

	.tags {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 35px;
		flex-shrink: 0;
	}

	.tag {
		display: flex;
		width: 100px;
		height: 30px;
		padding: 0 1rem;
		justify-content: center;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
		border-radius: 15px;
		background: #e0f0ff;
		color: #6c8aee;
		font-family: Inter;
		font-size: 16px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
		letter-spacing: 1.6px;
	}
</style>
