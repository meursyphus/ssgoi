<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<PageTransition>
	<div class="pin-detail">
		<!-- Back button -->
		<a href="/demo/pinterest" class="back-button">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
			<span>Back</span>
		</a>

		<!-- Pin content -->
		<div class="pin-container">
			<img 
				class="pin-image" 
				src={data.item.image}
				alt={data.item.title}
				style="aspect-ratio: {data.item.aspectRatio};"
				data-pinterest-key={data.item.id}
			/>
			
			<div class="pin-info">
				<h1>{data.item.title}</h1>
				<p class="description">{data.item.content}</p>
				
				<!-- Category and saves -->
				<div class="pin-meta">
					<span class="category">{data.item.category}</span>
					<span class="saves">{data.item.saves.toLocaleString()} saves</span>
				</div>
				
				<!-- Tags -->
				<div class="tags">
					{#each data.item.tags as tag}
						<span class="tag">#{tag}</span>
					{/each}
				</div>
				
				<!-- Ingredients/Materials/Steps -->
				{#if data.item.ingredients}
					<div class="section">
						<h3>Ingredients</h3>
						<ul>
							{#each data.item.ingredients as ingredient}
								<li>{ingredient}</li>
							{/each}
						</ul>
					</div>
				{/if}
				
				{#if data.item.materials}
					<div class="section">
						<h3>Materials</h3>
						<ul>
							{#each data.item.materials as material}
								<li>{material}</li>
							{/each}
						</ul>
					</div>
				{/if}
				
				{#if data.item.steps}
					<div class="section">
						<h3>Steps</h3>
						<ol>
							{#each data.item.steps as step}
								<li>{step}</li>
							{/each}
						</ol>
					</div>
				{/if}
				
				<!-- Author info -->
				<div class="author-section">
					<img src={data.item.author.avatar} alt={data.item.author.name} />
					<div>
						<div class="author-name">{data.item.author.name}</div>
						<div class="author-bio">{data.item.author.bio}</div>
						<div class="author-followers">{data.item.author.followers.toLocaleString()} followers</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</PageTransition>

<style>
	.pin-detail {
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

	.pin-container {
		margin-bottom: 3rem;
	}

	.pin-image {
		width: 100%;
		height: auto;
		object-fit: cover;
		border-radius: 16px;
		margin-bottom: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		background-color: #f0f0f0;
		min-height: 200px;
	}

	.pin-info h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	.description {
		font-size: 1rem;
		line-height: 1.6;
		color: #333;
		margin-bottom: 1.5rem;
	}

	.pin-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.category {
		background: #f5f5f5;
		padding: 0.375rem 0.75rem;
		border-radius: 16px;
		font-weight: 500;
	}

	.saves {
		color: #666;
		font-weight: 500;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.tag {
		font-size: 0.875rem;
		color: #E60023;
		background: #FEE7E7;
		padding: 0.25rem 0.75rem;
		border-radius: 16px;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.section ul,
	.section ol {
		padding-left: 1.5rem;
	}

	.section li {
		margin-bottom: 0.5rem;
		line-height: 1.5;
		color: #333;
	}

	.author-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: #f9f9f9;
		border-radius: 12px;
		margin-bottom: 3rem;
	}

	.author-section img {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		object-fit: cover;
	}

	.author-name {
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.author-bio {
		font-size: 0.875rem;
		color: #666;
		margin-bottom: 0.25rem;
		line-height: 1.4;
	}

	.author-followers {
		font-size: 0.75rem;
		color: #999;
	}

	.related-pins {
		border-top: 1px solid #eee;
		padding-top: 2rem;
	}

	.related-pins h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.related-pin {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		display: block;
		transition: transform 0.2s ease;
	}

	.related-pin:hover {
		transform: translateY(-2px);
	}

	.related-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1rem;
		background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
		color: white;
	}

	.related-overlay h4 {
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
		line-height: 1.2;
	}

	.related-overlay span {
		font-size: 0.75rem;
		opacity: 0.9;
	}
</style>