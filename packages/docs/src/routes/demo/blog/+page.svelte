<script lang="ts">
	import { faker } from '@faker-js/faker';
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';
	import { PageTransition, Ssgoi } from 'ssgoi';

	type Blog = {
		name: string;
		description: string;
	};

	faker.seed(123);

	const blogs: Blog[] = new FixtureFactory(() => ({
		name: faker.person.fullName(),
		description: faker.lorem.paragraphs() + faker.lorem.paragraphs() + faker.lorem.paragraphs()
	})).createList(10);
</script>

<PageTransition>
	{#each blogs as blog}
		<article>
			<h1>{blog.name}</h1>
			<p class="spread">{blog.description}</p>
		</article>
	{/each}
</PageTransition>

<style>
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
