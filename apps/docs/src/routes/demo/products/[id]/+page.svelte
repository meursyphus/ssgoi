<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import type { PageData } from './$types';

	export let data: PageData;

	let quantity = 1;
</script>

<PageTransition>
	<div class="product-detail">
		<!-- Back button -->
		<a href="/demo/products" class="back-button">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M19 12H5M12 19l-7-7 7-7" />
			</svg>
			<span>Back</span>
		</a>

		<!-- Product content -->
		<div class="product-container">
			<div data-hero-key={data.product.id} class="product-image">
				<img src={data.product.image} alt={data.product.name} />
				{#if data.product.badge}
					<span class="badge {data.product.badge}">{data.product.badge}</span>
				{/if}
			</div>

			<div class="product-info">
				<span class="category">{data.product.category}</span>
				<h1>{data.product.name}</h1>

				<div class="rating">
					<span class="stars">★★★★★</span>
					<span class="rating-value">{data.product.rating}</span>
					<span class="reviews">({data.product.reviews} reviews)</span>
				</div>

				<p class="description">{data.product.description}</p>

				<div class="price-section">
					<div class="price">
						${data.product.price}
						{#if data.product.originalPrice}
							<span class="original-price">${data.product.originalPrice}</span>
							<span class="discount">
								-{Math.round((1 - data.product.price / data.product.originalPrice) * 100)}%
							</span>
						{/if}
					</div>
				</div>

				{#if data.product.features}
					<div class="features">
						<h3>Key Features</h3>
						<ul>
							{#each data.product.features as feature}
								<li>{feature}</li>
							{/each}
						</ul>
					</div>
				{/if}

				<div class="purchase-section">
					{#if data.product.inStock}
						<div class="quantity-selector">
							<button
								onclick={() => (quantity = Math.max(1, quantity - 1))}
								disabled={quantity <= 1}
							>
								-
							</button>
							<span>{quantity}</span>
							<button onclick={() => quantity++}>+</button>
						</div>

						<button class="add-to-cart">Add to Cart</button>
						<button class="buy-now">Buy Now</button>
					{:else}
						<p class="out-of-stock">Out of Stock</p>
						<button class="notify-me">Notify When Available</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</PageTransition>

<style>
	.product-detail {
		padding: 1rem 0 3rem;
		padding-inline: 16px;
		min-height: calc(100vh - 200px);
		background: white;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #666;
		text-decoration: none;
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
		transition: color 0.2s ease;
	}

	.back-button:hover {
		color: #333;
	}

	.product-container {
		margin-bottom: 3rem;
	}

	.badge {
		position: absolute;
		top: 1rem;
		left: 1rem;
		padding: 0.375rem 0.75rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.badge.new {
		background: #4ecdc4;
		color: white;
	}

	.badge.sale {
		background: #ff6b6b;
		color: white;
	}

	.badge.bestseller {
		background: #ffd93d;
		color: #333;
	}

	.product-image {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		border-radius: 16px;
		margin-bottom: 1.5rem;
		overflow: hidden;
	}
	
	.product-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		background-color: #f0f0f0;
	}

	.category {
		font-size: 0.875rem;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0.5rem 0 1rem;
		line-height: 1.2;
	}

	.rating {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.stars {
		color: #ffd700;
		font-size: 1.125rem;
		letter-spacing: -2px;
	}

	.rating-value {
		font-weight: 600;
		color: #333;
	}

	.reviews {
		font-size: 0.875rem;
		color: #666;
	}

	.description {
		font-size: 1rem;
		line-height: 1.6;
		color: #333;
		margin-bottom: 1.5rem;
	}

	.price-section {
		margin-bottom: 1.5rem;
	}

	.price {
		font-size: 1.5rem;
		font-weight: 700;
		color: #333;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.original-price {
		font-size: 1.125rem;
		font-weight: 400;
		color: #999;
		text-decoration: line-through;
	}

	.discount {
		background: #ff6b6b;
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.features {
		margin-bottom: 2rem;
	}

	.features h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.features ul {
		padding-left: 1.5rem;
	}

	.features li {
		margin-bottom: 0.5rem;
		color: #333;
		line-height: 1.5;
	}

	.purchase-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.quantity-selector {
		display: flex;
		align-items: center;
		gap: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 0.5rem;
		width: fit-content;
	}

	.quantity-selector button {
		width: 32px;
		height: 32px;
		border: none;
		background: #f5f5f5;
		border-radius: 4px;
		font-size: 1.125rem;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.quantity-selector button:hover:not(:disabled) {
		background: #e5e5e5;
	}

	.quantity-selector button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.quantity-selector span {
		min-width: 40px;
		text-align: center;
		font-weight: 600;
	}

	.add-to-cart,
	.buy-now,
	.notify-me {
		padding: 1rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.add-to-cart {
		background: white;
		color: #333;
		border: 2px solid #333;
	}

	.add-to-cart:hover {
		background: #333;
		color: white;
	}

	.buy-now {
		background: #4ecdc4;
		color: white;
	}

	.buy-now:hover {
		background: #45b7d1;
	}

	.notify-me {
		background: #f5f5f5;
		color: #333;
	}

	.notify-me:hover {
		background: #e5e5e5;
	}

	.out-of-stock {
		text-align: center;
		color: #999;
		font-weight: 500;
		margin-bottom: 1rem;
	}

	.related-products {
		border-top: 1px solid #eee;
		padding-top: 2rem;
	}

	.related-products h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.related-card {
		text-decoration: none;
		color: inherit;
		display: block;
		background: white;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid #eee;
		transition: all 0.2s ease;
	}

	.related-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.related-image {
		width: 100%;
		aspect-ratio: 1;
		background-size: cover;
		background-position: center;
	}

	.related-info {
		padding: 0.75rem;
	}

	.related-info h4 {
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		line-height: 1.2;
	}

	.related-price {
		font-size: 0.875rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.related-price .original {
		font-size: 0.75rem;
		color: #999;
		text-decoration: line-through;
		font-weight: 400;
	}
</style>
