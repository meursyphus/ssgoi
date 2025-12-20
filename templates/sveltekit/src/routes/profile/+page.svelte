<script lang="ts">
	import { SsgoiTransition } from '@ssgoi/svelte';
	import { profile, posts } from '$lib/data/profile';
</script>

<SsgoiTransition id="/profile">
	<div class="bg-[#121212]">
		<!-- Profile Header -->
		<div class="relative">
			<!-- Cover Image -->
			<div class="h-24 relative">
				<img src={profile.coverImage} alt="Cover" class="w-full h-full object-cover" />
				<div class="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>
			</div>

			<!-- Profile Info -->
			<div class="px-4 -mt-8 relative">
				<!-- Avatar -->
				<img
					src={profile.avatar}
					alt={profile.name}
					class="w-16 h-16 rounded-full border-4 border-[#121212] bg-[#111]"
				/>

				<!-- Profile Details -->
				<div class="mt-3">
					<div class="flex items-center gap-1.5 mb-1">
						<h1 class="text-base font-medium text-white">{profile.name}</h1>
						{#if profile.verified}
							<svg width="14" height="14" viewBox="0 0 24 24" fill="#1DA1F2">
								<path
									d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
								/>
							</svg>
						{/if}
					</div>
					<p class="text-neutral-400 text-xs mb-2">{profile.username}</p>
					<p class="text-neutral-300 text-xs mb-3">{profile.bio}</p>

					<!-- Stats -->
					<div class="flex gap-4 mb-3">
						<div class="text-center">
							<span class="block text-sm font-medium text-white">{profile.posts}</span>
							<span class="block text-xs text-neutral-500">Posts</span>
						</div>
						<div class="text-center">
							<span class="block text-sm font-medium text-white">
								{profile.followers.toLocaleString()}
							</span>
							<span class="block text-xs text-neutral-500">Followers</span>
						</div>
						<div class="text-center">
							<span class="block text-sm font-medium text-white">
								{profile.following.toLocaleString()}
							</span>
							<span class="block text-xs text-neutral-500">Following</span>
						</div>
					</div>

					<!-- Meta Info -->
					<div class="flex flex-col gap-1 text-xs text-neutral-400 mb-4">
						<span>{profile.location}</span>
						<span>
							<a href={profile.website} target="_blank" rel="noopener" class="text-neutral-300 hover:underline">
								{profile.website.replace('https://', '')}
							</a>
						</span>
					</div>

					<!-- Follow Button -->
					<button
						class="w-full bg-white text-black py-2 rounded-full text-xs font-medium hover:bg-neutral-200 transition-colors duration-200"
					>
						Follow
					</button>
				</div>
			</div>
		</div>

		<!-- Posts Section - Instagram Style Feed -->
		<div class="mt-6 pb-6">
			<div class="bg-[#121212] p-1">
				<!-- Header -->
				<div class="mb-2 px-3 pt-2">
					<h2 class="text-sm font-medium text-white mb-0.5">Posts</h2>
					<p class="text-neutral-500 text-xs">Tap any post to view details</p>
				</div>

				<!-- Instagram 3-Column Masonry Grid -->
				<div class="columns-3 gap-1">
					{#each posts as post (post.id)}
						<a href="/profile/{post.id}" class="cursor-pointer group break-inside-avoid block mb-1">
							<div class="relative">
								<img
									src={post.coverImage.url}
									alt={post.title}
									class="w-full h-auto object-cover transition-transform duration-200"
									data-instagram-gallery-key={post.id}
								/>
								<!-- Overlay on hover -->
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
								>
									<div class="absolute bottom-0 left-0 right-0 p-2">
										<h3 class="text-white text-xs font-medium line-clamp-2 mb-1">
											{post.title}
										</h3>
										<div class="flex items-center gap-2 text-white text-xs">
											<span class="flex items-center gap-0.5">
												<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
													<path
														d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
													/>
												</svg>
												{post.likes}
											</span>
											<span class="flex items-center gap-0.5">
												<svg
													width="10"
													height="10"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<path
														d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
													/>
												</svg>
												{post.comments}
											</span>
										</div>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</SsgoiTransition>
