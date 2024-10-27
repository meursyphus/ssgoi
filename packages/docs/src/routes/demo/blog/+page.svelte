<script lang="ts">
	import { faker } from '@faker-js/faker';
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';
	import { PageTransition } from 'ssgoi';
	import { fade } from 'svelte/transition';

	type Blog = {
		id: string;
		name: string;
		description: string;
		date: string;
		readTime: number;
	};

	faker.seed(123);
	const blogs: Blog[] = new FixtureFactory(() => ({
		id: faker.number.hex({ min: 0, max: 65535123 }),
		name: faker.lorem.sentence(),
		description: faker.lorem.paragraph(),
		date: faker.date.recent().toLocaleDateString(),
		readTime: faker.number.int({ min: 2, max: 15 })
	})).createList(10);
</script>

<PageTransition class="blog-page">
	<div class="blog-container">
		<header>
			<h1>Latest Blog Posts</h1>
			<div class="header-decoration" />
		</header>

		<div class="blog-grid">
			{#each blogs as blog (blog.id)}
				<article class="blog-card" in:fade={{ duration: 300, delay: 150 }}>
					<div class="card-content">
						<div class="blog-meta">
							<time datetime={blog.date}>{blog.date}</time>
							<span class="dot">·</span>
							<span class="read-time">{blog.readTime} min read</span>
						</div>

						<h2>{blog.name}</h2>
						<p class="description">{blog.description}</p>

						<a href={`/demo/post/${blog.id}`} class="read-more">
							Read Article
							<span class="arrow">→</span>
						</a>
					</div>
				</article>
			{/each}
		</div>
	</div>
</PageTransition>

<style>
	.blog-container {
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
		background: #1b315e;
		bottom: -1rem;
		left: 50%;
		transform: translateX(-50%);
	}

	h1 {
		color: #1b315e;
		font-size: 2.5rem;
		font-weight: 300;
		letter-spacing: -0.5px;
	}

	.blog-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.blog-card {
		background-color: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;
	}

	.blog-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
	}

	.card-content {
		padding: 2rem;
	}

	.blog-meta {
		font-size: 0.875rem;
		color: #666;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.dot {
		color: #1b315e;
		opacity: 0.5;
	}

	h2 {
		color: #1b315e;
		font-size: 1.5rem;
		margin-bottom: 1rem;
		font-weight: 500;
		line-height: 1.3;
	}

	.description {
		color: #2c2c2c;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		opacity: 0.8;
	}

	.read-more {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #1b315e;
		text-decoration: none;
		font-weight: 500;
		font-size: 0.875rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid transparent;
		transition: all 0.2s ease;
	}

	.arrow {
		transition: transform 0.2s ease;
	}

	.read-more:hover {
		border-bottom-color: #1b315e;
	}

	.read-more:hover .arrow {
		transform: translateX(4px);
	}

	@media (min-width: 768px) {
		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.blog-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	:global(.blog-page) {
		background: white;
	}
</style>
