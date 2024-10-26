<script lang="ts">
	let intersecting = $state(false);

	// Intersection Observer for animation
	const observeIntersection = (node: HTMLElement) => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					intersecting = entry.isIntersecting;
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	};
</script>

<main class="landing">
	<!-- Main Demo Section -->
	<section class="demo-section" use:observeIntersection>
		<div class="content-wrap">
			<h1>Native App Experience for Your Svelte App</h1>
			<p class="tagline">
				Turn your Svelte app into an app-like experience with just a few lines of code
			</p>
			<div class="cta-group">
				<a href="/docs" class="cta primary">Get Started</a>
				<a href="https://github.com/your-repo" class="cta secondary">GitHub</a>
			</div>
		</div>
		<div class="demo-container">
			<img src="/pinterest.gif" alt="Pinterest-style transition demo" class="demo-gif" />
		</div>
	</section>

	<!-- Benefits Section -->
	<section class="benefits" class:visible={intersecting}>
		<div class="benefit-card">
			<div class="icon">🚀</div>
			<h3>Native-like Navigation</h3>
			<p>
				Smooth back/forward navigation that feels just like a native app. Perfect for mobile-first
				experiences.
			</p>
		</div>

		<div class="benefit-card">
			<div class="icon">✨</div>
			<h3>Pinterest-style Transitions</h3>
			<p>
				Create engaging image grid to detail transitions that users love. Ideal for galleries and
				product showcases.
			</p>
		</div>

		<div class="benefit-card">
			<div class="icon">💡</div>
			<h3>Easy Implementation</h3>
			<p>
				Simple component wrapping without complex configurations. Get started in minutes, not hours.
			</p>
		</div>
	</section>

	<!-- View Transition API Comparison -->
	<section class="why-ssgoi">
		<h2>View Transitions API? Nah.</h2>
		<div class="comparison">
			<div class="pain-points">
				<h3>Browser APIs are not enough</h3>
				<ul class="problems">
					<li>
						<span class="emoji">🌍</span>
						<strong>Limited browser support</strong>
						<p>Chrome-only? Really? Your users deserve better</p>
					</li>
					<li>
						<span class="emoji">🤖</span>
						<strong>Incomplete implementation</strong>
						<p>Buggy behaviors and edge cases everywhere</p>
					</li>
					<li>
						<span class="emoji">😵</span>
						<strong>Complex state handling</strong>
						<p>Manual state management between pages is painful</p>
					</li>
				</ul>
			</div>

			<div class="solution">
				<h3>SSGOI does it right</h3>
				<ul class="benefits">
					<li>
						<span class="emoji">🌈</span>
						<strong>Works everywhere</strong>
						<p>All modern browsers supported out of the box</p>
					</li>
					<li>
						<span class="emoji">🚀</span>
						<strong>SSR Ready</strong>
						<p>Seamless server-side rendering support</p>
					</li>
					<li>
						<span class="emoji">🧩</span>
						<strong>Web Native</strong>
						<p>Built for the web, respecting web standards</p>
					</li>
					<li>
						<span class="emoji">⚡️</span>
						<strong>Always Smooth</strong>
						<p>Consistent animations across all platforms</p>
					</li>
				</ul>
			</div>
		</div>
	</section>
</main>

<style>
	.landing {
		width: 100%;
		max-width: 1440px;
		margin: 0 auto;
		padding: 2rem;
	}

	/* Demo Section */
	.demo-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		padding: 4rem 0;
		align-items: center;
	}

	h1 {
		font-size: clamp(2.5rem, 5vw, 4rem);
		line-height: 1.1;
		font-weight: 800;
		background: linear-gradient(45deg, #ff4d4d, #ff8c8c);
		-webkit-background-clip: text;
		color: transparent;
		margin-bottom: 1.5rem;
	}

	.tagline {
		font-size: 1.25rem;
		color: #666;
		margin-bottom: 2rem;
	}

	.cta-group {
		display: flex;
		gap: 1rem;
	}

	.cta {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-weight: 600;
		transition: transform 0.2s;
	}

	.cta:hover {
		transform: translateY(-2px);
	}

	.primary {
		background: linear-gradient(45deg, #ff4d4d, #ff8c8c);
		color: white;
	}

	.secondary {
		border: 2px solid #ff4d4d;
		color: #ff4d4d;
	}

	.demo-container {
		width: 100%;
		aspect-ratio: 16/9;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	.demo-gif {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Benefits Section */
	.benefits {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		padding: 4rem 0;
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.6s ease-out;
	}

	.benefits.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.benefit-card {
		padding: 2rem;
		border-radius: 16px;
		background: white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		transition: transform 0.2s;
	}

	.benefit-card:hover {
		transform: translateY(-4px);
	}

	.icon {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	/* View Transition API Comparison Section */
	.why-ssgoi {
		padding: 4rem 0;
	}

	.why-ssgoi h2 {
		font-size: clamp(2rem, 4vw, 3rem);
		margin-bottom: 3rem;
		text-align: center;
	}

	.comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.pain-points,
	.solution {
		padding: 2rem;
		border-radius: 16px;
	}

	.pain-points {
		background: #fff1f1;
		border: 2px solid #ffd1d1;
	}

	.solution {
		background: #f1fff1;
		border: 2px solid #d1ffd1;
	}

	.problems,
	.benefits {
		display: grid;
		gap: 1.5rem;
	}

	li {
		display: grid;
		gap: 0.5rem;
	}

	.emoji {
		font-size: 1.5rem;
	}

	strong {
		font-weight: 600;
		font-size: 1.1rem;
	}

	p {
		color: #666;
		line-height: 1.5;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.demo-section {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.comparison {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.cta-group {
			flex-direction: column;
		}
	}
</style>
