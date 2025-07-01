<script lang="ts">
	let visible = $state(false);
	setTimeout(() => {
		visible = true;
	}, 1000);
</script>

<main class="landing">
	<section class="demo-section">
		<div class="content-wrap">
			<h1>Native App Experience for Your Svelte App</h1>
			<p class="tagline">
				Turn your Svelte app into an app-like experience with just a few lines of code
			</p>
			<div class="cta-group">
				<a href="/docs" class="cta primary">Get Started</a>
				<a href="https://github.com/meursyphus/ssgoi" class="cta secondary">GitHub</a>
			</div>
		</div>
		<div class="demo-container">
			<img src="/pinterest.gif" alt="Pinterest-style transition demo" class="demo-gif" />
		</div>
	</section>

	<section class="benefits" class:visible>
		<div class="benefit-card">
			<div class="icon">⚡</div>
			<h3>Zero-Impact Performance</h3>
			<p>
				Built with performance in mind. No SSR conflicts, no hydration issues, and minimal runtime
				overhead for buttery-smooth transitions.
			</p>
		</div>
		<div class="benefit-card">
			<div class="icon">🎨</div>
			<h3>Beyond View Transitions</h3>
			<p>
				Powerful customization that goes beyond View Transitions API. Create complex, multi-stage
				transitions with complete creative control.
			</p>
		</div>
		<div class="benefit-card">
			<div class="icon">🌐</div>
			<h3>Browser Battle-Tested</h3>
			<p>
				Works reliably across all modern browsers with intelligent fallbacks. No need to worry about
				compatibility or degraded experiences.
			</p>
		</div>
	</section>
</main>

<style>
	.landing {
		max-width: 1440px;
		margin: 0 auto;
		padding: 2rem;
	}

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
		background-clip: text;
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
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
	}

	.demo-gif {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

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

	h3 {
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	p {
		color: #666;
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.demo-section {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.cta-group {
			flex-direction: column;
		}
	}

	/* 다크 모드 스타일 */
	:global(html[color-scheme='dark']) .landing {
		background-color: #121212;
	}

	:global(html[color-scheme='dark']) h1 {
		background: linear-gradient(45deg, #ff6b6b, #ffa0a0);
		-webkit-background-clip: text;
		background-clip: text;
	}

	:global(html[color-scheme='dark']) h3 {
		color: #e0e0e0;
	}

	:global(html[color-scheme='dark']) .tagline,
	:global(html[color-scheme='dark']) p {
		color: #a0a0a0;
	}

	:global(html[color-scheme='dark']) .benefit-card {
		background: #1e1e1e;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	:global(html[color-scheme='dark']) .benefit-card:hover {
		border-color: var(--color-text-dark);
	}

	:global(html[color-scheme='dark']) .demo-container {
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
	}

	:global(html[color-scheme='dark']) .primary {
		background: var(--color-text-dark);
		color: var(--color-bg-dark);
	}

	:global(html[color-scheme='dark']) .secondary {
		border-color: #ff6b6b;
		color: #ff6b6b;
	}

	:global(html[color-scheme='dark']) .icon {
		color: #e0e0e0;
	}
	.demo-section {
		display: grid;
		/* 좌측 컨텐츠가 더 넓게 차지하도록 비율 조정 */
		grid-template-columns: 1.2fr 0.8fr;
		gap: 4rem;
		padding: 4rem 0;
		align-items: start; /* center에서 start로 변경 */
	}

	.content-wrap {
		position: sticky;
		top: 4rem; /* 스크롤 시 고정 위치 */
	}

	.demo-container {
		width: 100%;
		/* 16:9 대신 2:3 비율로 변경 */
		aspect-ratio: 2/3;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	/* 모바일 대응도 수정 */
	@media (max-width: 768px) {
		.demo-section {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.content-wrap {
			position: static;
		}

		.demo-container {
			/* 모바일에서는 좀 더 작게 */
			max-width: 400px;
			margin: 0 auto;
		}
	}
</style>
