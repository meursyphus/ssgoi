<script lang="ts">
	import Hero from '$lib/Hero.svelte';
	import { PageTranstion, transitions } from '$lib/index.js';
	import { faker } from '@faker-js/faker';
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';

	faker.seed(14);
	const colors = new FixtureFactory(() => faker.color.human())
		.createList(9)
		.map((color) => color.toString());
</script>

<PageTranstion
	animations={[
		{ transtion: transitions.none },
		{ path: '/blog', transtion: transitions.ripple },
		{ path: '/post', transtion: transitions.ripple }
	]}
>
	<div class="tmp">
		<div class="container">
			{#each colors as key (key)}
				<!-- <a href="/image/{key}">
					<div style="background: {key};" class="box"></div>
				</a> -->
				<Hero {key}>
					<a href="/image/{key}">
						<div style="background: {key};" class="box"></div>
					</a>
				</Hero>
			{/each}
		</div>
	</div>
</PageTranstion>

<style>
	.tmp {
		background-color: beige;
		display: flex;
		justify-content: center;
	}
	.container {
		padding: 16px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-items: center;
		gap: 16px;
	}

	.box {
		width: 300px;
		height: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
		color: black;
	}
</style>
