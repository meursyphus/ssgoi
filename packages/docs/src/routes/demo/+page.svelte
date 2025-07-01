<script lang="ts">
	import { PageTransition } from 'ssgoi';

	const features = [
		{ 
			title: 'Browse Posts', 
			description: 'Read insightful articles about Svelte and Flutter',
			href: '/demo/post',
			color: '#FF3E00'
		},
		{ 
			title: 'Shop Products', 
			description: 'Explore our curated collection of items',
			href: '/demo/products',
			color: '#4ECDC4'
		},
		{ 
			title: 'Pinterest Gallery', 
			description: 'Discover inspiring ideas across categories',
			href: '/demo/pinterest',
			color: '#E60023'
		},
		{ 
			title: 'User Profile', 
			description: 'View profile and personal posts',
			href: '/demo/profile',
			color: '#45B7D1'
		}
	];
</script>

<PageTransition>
	<div class="demo-home">
		<h1>SSGOI Demo</h1>
		<p class="subtitle">Experience smooth page transitions</p>
		
		<div class="features">
			{#each features as feature}
				<a href={feature.href} class="feature-card">
					<div class="color-block" style="background-color: {feature.color}"></div>
					<h3>{feature.title}</h3>
					<p>{feature.description}</p>
				</a>
			{/each}
		</div>
	</div>
</PageTransition>

<style>
	.demo-home {
		min-height: calc(100vh - 200px);
		padding: 2rem 0;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 800;
		text-align: center;
		margin-bottom: 0.5rem;
		color: var(--color-text);
	}

	.subtitle {
		text-align: center;
		color: #666;
		margin-bottom: 3rem;
		font-size: 1.1rem;
	}

	.features {
		display: grid;
		gap: 1rem;
	}

	.feature-card {
		display: block;
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		border: 1px solid #eee;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.feature-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		border-color: #ddd;
	}

	.color-block {
		width: 60px;
		height: 60px;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.feature-card p {
		color: #666;
		font-size: 0.95rem;
		line-height: 1.5;
	}
</style>