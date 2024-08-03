<script lang="ts">
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';
	import { faker } from '@faker-js/faker';
	import { PageTransition } from 'ssgoi';

	type Post = {
		id: number;
		title: string;
		content: string;
		author: string;
		date: string;
		tags: string[];
	};

	faker.seed(123);

	const postFactory = new FixtureFactory<Post>(() => ({
		id: faker.number.int({ min: 0, max: 9999 }),
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraphs(5),
		author: faker.person.fullName(),
		date: faker.date.recent().toLocaleDateString(),
		tags: faker.helpers.arrayElements(['Tech', 'Life', 'Food', 'Travel', 'Health'], 3)
	}));

	const posts: Post[] = postFactory.createList(5);
</script>

<PageTransition>
	<div class="posts-container">
		<h1>Featured Posts</h1>
		{#each posts as post (post.id)}
			<article class="post">
				<h2>{post.title}</h2>
				<div class="post-meta">
					<span class="author">By {post.author}</span>
					<span class="date">{post.date}</span>
				</div>
				<div class="tags">
					{#each post.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
				<p class="content">{post.content}</p>
			</article>
		{/each}
	</div>
</PageTransition>

<style>
	.posts-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: #2c3e50;
		text-align: center;
		margin-bottom: 2rem;
	}

	.post {
		background-color: white;
		border-radius: 8px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	h2 {
		color: #3498db;
		margin-bottom: 0.5rem;
	}

	.post-meta {
		font-size: 0.9rem;
		color: #7f8c8d;
		margin-bottom: 1rem;
	}

	.author,
	.date {
		margin-right: 1rem;
	}

	.tags {
		margin-bottom: 1rem;
	}

	.tag {
		display: inline-block;
		background-color: #ecf0f1;
		color: #2c3e50;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		margin-right: 0.5rem;
	}

	.content {
		color: #34495e;
		line-height: 1.6;
	}
</style>
