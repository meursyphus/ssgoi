<template>
  <SsgoiTransition :id="`/posts/${id}`">
    <div v-if="!post" class="min-h-screen bg-[#121212] px-4 py-8">
      <p class="text-gray-400">Post not found</p>
    </div>
    <div v-else class="min-h-screen bg-[#121212]">
      <!-- Back button -->
      <div class="px-4 py-4">
        <NuxtLink
          to="/posts"
          class="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-xs"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </NuxtLink>
      </div>

      <!-- Post header -->
      <div class="px-4 pb-6">
        <div class="flex items-center gap-3 mb-4 text-xs">
          <span class="px-2 py-0.5 bg-white/5 text-neutral-400 rounded">
            {{ post.category }}
          </span>
          <span class="text-neutral-500">{{ post.readTime }} min read</span>
        </div>

        <h1 class="text-xl font-medium text-white mb-3">{{ post.title }}</h1>
        <p class="text-sm text-neutral-400 mb-6">{{ post.excerpt }}</p>

        <!-- Author info -->
        <div class="flex items-center gap-3">
          <img
            :src="post.author.avatar"
            :alt="post.author.name"
            class="w-8 h-8 rounded-full"
          />
          <div>
            <div class="text-xs font-medium text-white">
              {{ post.author.name }}
            </div>
            <div class="text-xs text-neutral-500">{{ post.author.role }}</div>
            <div class="text-xs text-neutral-600">
              {{ formatDate(post.publishedAt) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Hero image -->
      <img
        :src="post.coverImage"
        :alt="post.title"
        class="w-full h-48 object-cover"
      />

      <!-- Post content -->
      <article class="px-4 py-6 prose prose-invert max-w-none">
        <div class="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
          {{ post.content }}
        </div>
      </article>

      <!-- Tags -->
      <div class="px-4 pb-6">
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Related posts -->
      <div
        v-if="relatedPosts.length > 0"
        class="border-t border-white/5 px-4 py-6"
      >
        <h3 class="text-sm font-medium text-white mb-3">More to Read</h3>
        <div class="space-y-2">
          <NuxtLink
            v-for="relatedPost in relatedPosts"
            :key="relatedPost.id"
            :to="`/posts/${relatedPost.id}`"
            class="flex gap-3 p-2 border border-white/5 rounded hover:border-white/10 transition-colors"
          >
            <img
              :src="relatedPost.coverImage"
              :alt="relatedPost.title"
              class="w-12 h-12 rounded object-cover flex-shrink-0"
            />
            <div class="flex-1">
              <h4 class="text-xs font-medium text-white line-clamp-2">
                {{ relatedPost.title }}
              </h4>
              <p class="text-xs text-neutral-500 mt-0.5">
                {{ relatedPost.readTime }} min read
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </SsgoiTransition>
</template>

<script setup lang="ts">
import { SsgoiTransition } from '@ssgoi/vue';

const route = useRoute();
const id = route.params.id as string;

const post = usePost(id);
const relatedPosts = useRelatedPosts(id, 3);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
