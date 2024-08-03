<script lang="ts">
	import { PageTransition, Hero } from 'ssgoi';
	import { faker } from '@faker-js/faker';
	import { FixtureFactory } from '@reflow-work/test-fixture-factory';

	faker.seed(14);
	const colors = new FixtureFactory(() => faker.color.human())
		.createList(9)
		.map((color) => color.toString());
</script>

<PageTransition>
	<div class="tmp">
		<div class="container">
			{#each colors as key (key)}
				<Hero {key}>
					<a href="/demo/image/{key}">
						<div style="background: {key};" class="box"></div>
					</a>
				</Hero>
			{/each}
		</div>
	</div>
</PageTransition>

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
