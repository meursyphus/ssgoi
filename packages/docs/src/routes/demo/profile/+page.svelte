<script lang="ts">
	import { PageTransition } from 'ssgoi';
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<PageTransition>
	<div class="profile-container">
		<!-- Profile header -->
		<div class="profile-header">
			<img class="cover-image" src={data.profile.coverImage} alt="Cover" />
			
			<div class="profile-info">
				<img src={data.profile.avatar} alt={data.profile.name} class="avatar" />
				
				<div class="profile-details">
					<h1>
						{data.profile.name}
						{#if data.profile.verified}
							<svg class="verified-badge" width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2">
								<path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
							</svg>
						{/if}
					</h1>
					<p class="username">{data.profile.username}</p>
					<p class="bio">{data.profile.bio}</p>
					
					<div class="profile-stats">
						<div class="stat">
							<span class="stat-value">{data.profile.posts}</span>
							<span class="stat-label">Posts</span>
						</div>
						<div class="stat">
							<span class="stat-value">{data.profile.followers.toLocaleString()}</span>
							<span class="stat-label">Followers</span>
						</div>
						<div class="stat">
							<span class="stat-value">{data.profile.following.toLocaleString()}</span>
							<span class="stat-label">Following</span>
						</div>
					</div>
					
					<div class="profile-meta">
						<span>📍 {data.profile.location}</span>
						<span>🔗 <a href={data.profile.website} target="_blank" rel="noopener">{data.profile.website.replace('https://', '')}</a></span>
					</div>
					
					<button class="follow-button">Follow</button>
				</div>
			</div>
		</div>
		
		<!-- Posts section -->
		<div class="posts-section">
			<h2>Posts</h2>
			<div class="posts-grid">
				{#each data.posts as post}
					<div class="post-card">
						<img class="post-image" src={post.coverImage} alt={post.title} loading="lazy" />
						<div class="post-content">
							<span class="post-category">{post.category}</span>
							<h3>{post.title}</h3>
							<p>{post.excerpt}</p>
							<div class="post-stats">
								<span>❤️ {post.likes}</span>
								<span>💬 {post.comments}</span>
								<span>🔗 {post.shares}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</PageTransition>

<style>
	.profile-container {
		padding-bottom: 3rem;
		padding-inline: 16px;
		min-height: calc(100vh - 200px);
		background: white;
	}

	.profile-header {
		margin-bottom: 2rem;
	}

	.cover-image {
		width: calc(100% + 32px);
		height: 120px;
		margin: 0 -16px;
		object-fit: cover;
		background-color: #f0f0f0;
	}

	.profile-info {
		position: relative;
		padding: 0 1rem;
		margin-top: -40px;
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 4px solid white;
		background: white;
		object-fit: cover;
	}

	.profile-details {
		margin-top: 1rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.verified-badge {
		flex-shrink: 0;
	}

	.username {
		color: #666;
		font-size: 0.95rem;
		margin-bottom: 1rem;
	}

	.bio {
		font-size: 0.95rem;
		line-height: 1.5;
		color: #333;
		margin-bottom: 1rem;
	}

	.profile-stats {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
	}

	.stat {
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: 1.125rem;
		font-weight: 700;
		color: #333;
	}

	.stat-label {
		display: block;
		font-size: 0.875rem;
		color: #666;
	}

	.profile-meta {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #666;
		margin-bottom: 1.5rem;
	}

	.profile-meta a {
		color: #4ECDC4;
		text-decoration: none;
	}

	.profile-meta a:hover {
		text-decoration: underline;
	}

	.follow-button {
		background: #333;
		color: white;
		border: none;
		padding: 0.75rem 2rem;
		border-radius: 24px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.follow-button:hover {
		background: #000;
	}

	.posts-section {
		margin-top: 3rem;
		padding: 0 1rem;
	}

	.posts-section h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
	}

	.posts-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.post-card {
		display: block;
		background: white;
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		border: 1px solid #eee;
		transition: all 0.2s ease;
	}

	.post-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		border-color: #ddd;
	}

	.post-image {
		width: 100%;
		height: 120px;
		object-fit: cover;
	}

	.post-content {
		padding: 1rem;
	}

	.post-category {
		font-size: 0.75rem;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.post-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0.5rem 0;
		line-height: 1.3;
	}

	.post-card p {
		font-size: 0.875rem;
		color: #666;
		line-height: 1.5;
		margin-bottom: 1rem;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.post-stats {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: #666;
	}
	
	.post-image {
		width: 100%;
		height: 120px;
		object-fit: cover;
		background-color: #f0f0f0;
	}
</style>