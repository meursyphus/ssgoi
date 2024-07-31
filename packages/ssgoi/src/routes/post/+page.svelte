<script lang="ts">
	import { TempPageWrapper, transitions } from '$lib/index.js';
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';
	import { faker } from '@faker-js/faker';

	type Post = {
		id: number;
		title: string;
		content: string;
	};

	faker.seed(123);

	const postFactory = new FixtureFactory<Post>(() => ({
		id: faker.number.int({ min: 0, max: Infinity }),
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraphs()
	}));

	const posts: { title: string; content: string }[] = postFactory.createList(15);
</script>

<TempPageWrapper
>
	<div class="posts">
		{#each posts as post}
			<div class="post">
				<h2>{post.title}</h2>
				<p>{post.content}</p>
			</div>
		{/each}
	</div>
</TempPageWrapper>

<style>
	.posts {
		padding: 16px;
	}

	.post {
		background-color: #f2f2f2;
		padding: 4px;
		border-bottom: 1px solid #ccc;
	}
</style>
