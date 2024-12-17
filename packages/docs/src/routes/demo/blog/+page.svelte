<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import { fade } from 'svelte/transition';
	import { POSTS } from './blog-mock';
</script>

<PageTransition class="blog-page">
	<div class="blog-container">
		<h1>Explore Blog Examples</h1>
		<p class="intro">
			Check Out Examples of Built-in Functions! Use the built-in functions to make your site more
			dynamic and engaging.
		</p>

		{#each POSTS as blog (blog.id)}
			<a href={`/demo/blog/${blog.name.toLocaleLowerCase()}`} class="read-more">
				<article
					class="blog-card"
					in:fade={{ duration: 300, delay: 150 }}
					data-hero-key={blog.name.toLocaleLowerCase()}
					data-pinterest-key={blog.name.toLocaleLowerCase()}
				>
					<img class="card-cover-image" src={blog.coverImage} alt="POST_IMAGE" />
					<div class="card-content">
						<div class="card-content-header">
							<h2>{blog.name}</h2>
						</div>

						<div class="tags">
							{#each blog.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>

						<p class="description">{blog.description}</p>

						<div class="author">
							<span class="author-avatar"></span>
							<span>{blog.author}</span>
						</div>

						<div class="meta">
							<div class="blog-meta">
								<time datetime={blog.date}>{blog.date}</time>
								<span class="dot">·</span>
								<span class="read-time">{blog.readTime} min read</span>
							</div>
						</div>
					</div>
				</article>
			</a>
		{/each}
	</div>
</PageTransition>

<style>
	.blog-container {
		max-width: 1200px;
		margin: auto;
		padding: 2rem;
		text-align: center;
	}

	h1 {
		color: #2c3e50;
		margin-bottom: 1rem;
	}

	.intro {
		color: #7f8c8d;
		max-width: 600px;
		margin: 0 auto 2rem;
	}

	.read-more {
		width: 100%;
		height: 100%;
	}

	.blog-card {
		display: grid;
		grid-template-columns: 600px 1fr;
		background-color: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;
		margin-bottom: 2rem;
		text-align: left;
		width: 100%;
		height: 325px;
	}

	.blog-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
	}

	.card-cover-image {
		width: 600px;
		height: 100%;
		object-fit: cover;
		transition: all 0.3s ease;
	}

	.card-content {
		width: 100%;
		padding: 0 3rem;
	}
	.card-content-header {
		width: 100%;
	}

	.meta {
		display: flex;
		height: fit-content;
		padding: 10px 0;
		align-items: center;
		gap: 35px;
	}

	.blog-meta {
		height: fit-content;
		gap: 15px;
		color: #797777;
		font-family: Inter;
		font-size: 0.8rem;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		letter-spacing: 1.6px;
	}

	.dot {
		opacity: 0.5;
	}

	h2 {
		color: #000;
		font-family: Inter;
		font-size: 30px;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
		letter-spacing: 3px;
	}

	.description {
		width: 90%;
		padding: 0 auto;
		color: #333;
		font-family: Inter;
		font-size: 0.8rem;
		font-style: normal;
		font-weight: 400;
		line-height: 30px;
		letter-spacing: 1.6px;
	}

	.read-more {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		font-weight: 500;
		font-size: 0.875rem;
		padding: 0 10px;
		transition: all 0.2s ease;
	}

	.read-more:hover {
		border-bottom-color: #1b315e;
	}

	:global(.blog-page) {
		background: white;
	}

	.tags {
		display: flex;
		align-items: center;
		gap: 35px;
		flex-shrink: 0;
	}

	.tag {
		display: flex;

		padding: 0 1rem;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		border-radius: 15px;
		background: #e0f0ff;
		color: #6c8aee;
		font-family: Inter;
		font-size: 1rem;
		font-style: normal;
		font-weight: 700;
		line-height: normal;
		letter-spacing: 1.6px;
	}

	.author {
		display: flex;
		gap: 10px;
		align-items: center;
		color: #111;
	}

	.author-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #d1e0e6;
		display: block;
	}

	@media (max-width: 1024px) {
		.blog-card {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
		}

		.card-cover-image {
			width: 100%;
			height: 300px;
		}

		.tags {
			display: none;
		}
	}

	@media (max-width: 425px) {
		.blog-container {
			padding: 0;
		}

		.card-content {
			padding: 0.5rem;
		}

		.card-cover-image {
			width: 100%;
			height: 150px;
		}
	}
</style>
