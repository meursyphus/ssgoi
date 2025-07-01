<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<PageTransition>
	<div class="products-container">
		<h1>Shop</h1>
		<p class="subtitle">Discover our curated collection</p>
		
		<div class="products-grid">
			{#each data.products as product}
				<a href="/demo/products/{product.id}" class="product-card">
					<div data-hero-key={product.id} class="product-image">
						<img src={product.image} alt={product.name} />
						{#if product.badge}
							<span class="badge {product.badge}">{product.badge}</span>
						{/if}
					</div>
					
					<div class="product-info">
						<span class="category">{product.category}</span>
						<h3>{product.name}</h3>
						<p class="description">{product.description}</p>
						
						<div class="rating">
							<span class="stars">★★★★★</span>
							<span class="rating-value">{product.rating}</span>
							<span class="reviews">({product.reviews})</span>
						</div>
						
						<div class="price-section">
							<div class="price">
								${product.price}
								{#if product.originalPrice}
									<span class="original-price">${product.originalPrice}</span>
								{/if}
							</div>
							{#if !product.inStock}
								<span class="out-of-stock">Out of stock</span>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</PageTransition>

<style>
	.products-container {
		padding: 2rem 0;
		padding-inline: 16px;
		min-height: calc(100vh - 200px);
		background: white;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
		margin-bottom: 2rem;
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.product-card {
		display: block;
		background: white;
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		border: 1px solid #eee;
		transition: all 0.2s ease;
		position: relative;
	}

	.product-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		border-color: #ddd;
	}

	.badge {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.badge.new {
		background: #4ECDC4;
		color: white;
	}

	.badge.sale {
		background: #FF6B6B;
		color: white;
	}

	.badge.bestseller {
		background: #FFD93D;
		color: #333;
	}

	.product-image {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		border-radius: 12px 12px 0 0;
		overflow: hidden;
	}
	
	.product-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		background-color: #f0f0f0;
	}

	.product-info {
		padding: 1rem;
	}

	.category {
		font-size: 0.75rem;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.product-card h3 {
		font-size: 0.95rem;
		font-weight: 600;
		margin: 0.25rem 0 0.5rem;
		line-height: 1.2;
	}

	.description {
		display: none;
	}

	.rating {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		margin: 0.75rem 0;
	}

	.stars {
		color: #FFD700;
		letter-spacing: -2px;
	}

	.rating-value {
		font-weight: 600;
		color: #333;
	}

	.reviews {
		color: #666;
	}

	.price-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.price {
		font-size: 1.125rem;
		font-weight: 700;
		color: #333;
	}

	.original-price {
		font-size: 0.875rem;
		font-weight: 400;
		color: #999;
		text-decoration: line-through;
		margin-left: 0.5rem;
	}

	.out-of-stock {
		font-size: 0.75rem;
		color: #999;
		font-weight: 500;
	}

	@media (min-width: 380px) {
		.product-info {
			padding: 1.25rem;
		}

		.product-card h3 {
			font-size: 1rem;
		}

		.description {
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			font-size: 0.8rem;
			color: #666;
			line-height: 1.4;
			margin-bottom: 0.75rem;
		}
	}
</style>