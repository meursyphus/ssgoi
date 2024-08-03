<script lang="ts">
	import { faker } from '@faker-js/faker';
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';
	import { PageTransition } from 'ssgoi';

	type Blog = {
		id: string;
		name: string;
		description: string;
	};

	faker.seed(123);

	const blogs: Blog[] = new FixtureFactory(() => ({
		id: faker.number.hex({ min: 0, max: 65535123 }),
		name: faker.person.fullName(),
		description: faker.lorem.paragraphs() + faker.lorem.paragraphs() + faker.lorem.paragraphs()
	})).createList(10);
</script>

<PageTransition>
	<div>
		{#each blogs as blog (blog.id)}
			<article>
				<h1>{blog.name}</h1>
				<p class="spread">{blog.description}</p>
			</article>
		{/each}
	</div>
</PageTransition>

<style>
	div {
		background-color: #f2f2f2;
	}
	article {
		padding: 16px;
	}

	article:not(:first-of-type) {
		margin-top: 16px;
	}

	.spread {
		flex-grow: 1;
		background-color: aqua;
	}
</style>
