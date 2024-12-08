<script lang="ts">
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';
	import { faker } from '@faker-js/faker';
	import { PageTransition } from 'ssgoi';
	import { fade } from 'svelte/transition';

	type Post = {
		id: number;
		name: string;
		content: string;
		description: string;
		author: string;
		date: string;
		tags: string[];
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
</script>

<PageTransition class="post-page">
	<div class="posts-container">
		<header>
			<h1>Featured Posts</h1>
			<div class="header-decoration"></div>
		</header>

		<div class="posts-grid">
			{#each posts as post (post.id)}
				<article class="post" in:fade={{ duration: 300, delay: 150 }}>
					<div class="tags">
						{#each post.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>

					<h2>{post.name}</h2>

					<div class="post-meta">
						<div class="author-info">
							<span class="author-avatar" />
							<span class="author-name">{post.author}</span>
						</div>
						<time datetime={post.date}>{post.date}</time>
					</div>

					<div class="content">
						<p>{post.content}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</PageTransition>

<style>
	.posts-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 4rem 2rem;
	}

	header {
		text-align: center;
		margin-bottom: 4rem;
		position: relative;
	}

	.header-decoration {
		position: absolute;
		width: 60px;
		height: 2px;
		background: black;
		bottom: -1rem;
		left: 50%;
		transform: translateX(-50%);
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 300;
		letter-spacing: -0.5px;
	}

	.posts-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.post {
		background-color: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;
	}

	.post:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
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

	h2 {
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

	@media (min-width: 768px) {
		.posts-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.post {
			padding: 3rem;
		}
	}

	:global(.post-page) {
		background: white;
	}
</style>
