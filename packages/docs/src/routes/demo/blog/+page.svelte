<script lang="ts">
	import { faker } from '@faker-js/faker';
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';
	import { PageTransition } from 'ssgoi';

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

<PageTransition>
	<div class="blog-container">
		<h1>Latest Blog Posts</h1>
		{#each blogs as blog (blog.id)}
			<article class="blog-card">
				<h2>{blog.name}</h2>
				<div class="blog-meta">
					<span class="date">{blog.date}</span>
					<span class="read-time">{blog.readTime} min read</span>
				</div>
				<p class="description">{blog.description}</p>
				<a href={`/demo/post/${blog.id}`} class="read-more">Read More</a>
			</article>
		{/each}
	</div>
</PageTransition>

<style>
	.blog-container {
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		color: #2c3e50;
		text-align: center;
		margin-bottom: 2rem;
	}

	.blog-card {
		background-color: white;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		transition: transform 0.3s ease;
	}

	.blog-card:hover {
		transform: translateY(-5px);
	}

	h2 {
		color: #3498db;
		margin-bottom: 0.5rem;
	}

	.blog-meta {
		font-size: 0.9rem;
		color: #7f8c8d;
		margin-bottom: 1rem;
	}

	.date, .read-time {
		margin-right: 1rem;
	}

	.description {
		color: #34495e;
		line-height: 1.6;
	}

	.read-more {
		display: inline-block;
		margin-top: 1rem;
		color: #3498db;
		text-decoration: none;
		font-weight: bold;
	}

	.read-more:hover {
		text-decoration: underline;
	}
</style>