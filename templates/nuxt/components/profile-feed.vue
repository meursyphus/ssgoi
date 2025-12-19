<template>
  <div class="bg-[#121212] p-1">
    <!-- Header -->
    <div class="mb-2 px-3 pt-2">
      <h2 class="text-sm font-medium text-white mb-0.5">Posts</h2>
      <p class="text-neutral-500 text-xs">Tap any post to view details</p>
    </div>

    <!-- Instagram 3-Column Masonry Grid -->
    <div class="columns-3 gap-1">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
const posts = useAllProfilePosts();
</script>
