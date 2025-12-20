<template>
  <SsgoiTransition id="/posts">
    <div class="min-h-full bg-[#121212] px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-sm font-medium text-white mb-1">Latest Posts</h1>
        <p class="text-xs text-neutral-500">
          Insights on Svelte, Flutter, and web development
        </p>
      </div>

      <!-- Posts List -->
      <div class="space-y-2">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/posts/${post.id}`"
          class="block border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/10"
        >
          <div class="flex gap-3 p-3">
            <!-- Left: Cover Image -->
            <div class="flex-shrink-0">
              <img
                :src="post.coverImage"
                :alt="post.title"
                class="w-16 h-16 rounded object-cover bg-[#111]"
              />
            </div>

            <!-- Right: Content -->
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <!-- Title and excerpt -->
              <div>
                <h2 class="text-sm font-medium text-white mb-1 line-clamp-2">
                  {{ post.title }}
                </h2>
                <p class="text-xs text-neutral-400 line-clamp-2">
                  {{ post.excerpt }}
                </p>
              </div>

              <!-- Author and meta info -->
              <div class="flex items-center gap-2 mt-1">
                <img
                  :src="post.author.avatar"
                  :alt="post.author.name"
                  class="w-3 h-3 rounded-full"
                />
                <span class="text-xs text-neutral-500">
                  {{ post.author.name }}
                </span>
                <span class="text-xs text-neutral-600">•</span>
                <span class="text-xs text-neutral-500">
                  {{ post.readTime }}m
                </span>
                <span
                  class="text-xs px-2 py-0.5 bg-white/5 text-neutral-400 rounded ml-auto"
                >
                  {{ post.category }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </SsgoiTransition>
</template>

<script setup lang="ts">
import { SsgoiTransition } from '@ssgoi/vue';

const posts = useAllPosts();
</script>
