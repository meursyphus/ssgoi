<script lang="ts">
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';
	import { faker } from '@faker-js/faker';
	import { PageTransition } from 'ssgoi';
	import { fade } from 'svelte/transition';

	import {page} from '$app/stores'
	
	const slug = $page.params.detail;

	type Post = {
		id: number;
		name: string;
		content: string;
		author: string;
		date: string;
		tags: string[];
		description: string;
		readTime: number;
	};


	faker.seed(123);
	const postFactory = new FixtureFactory<Post>(() => (
		{
		id: faker.number.int({ min: 0, max: 9999 }),
		name: faker.lorem.sentence(),
		content: faker.lorem.paragraphs(5),
		description: faker.lorem.paragraph(),
		author: faker.person.fullName(),
		tags: faker.helpers.arrayElements(['Tech', 'Life', 'Food', 'Travel', 'Health'], 3),
		date: faker.date.recent().toLocaleDateString(),
		readTime: faker.number.int({ min: 2, max: 15 })
	}
	));
	const posts: Post[] = postFactory.createList(5);

	const post = posts.find(p => p.id.toString() === slug.toString());
</script>

<PageTransition class="post-page=detail">
	{#if post}
	<div class="posts-container">
		<header>
			<div class="tags">
				{#each post.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
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
				<p>{post.content}</p>
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
	}

	header {
		margin-bottom: 4rem;
		position: relative;
	}


	.post {
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
		background: #f7f3ee;
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
</style>
