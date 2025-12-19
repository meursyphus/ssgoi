<template>
  <SsgoiTransition :id="`/profile/${id}`">
    <div v-if="!post" class="bg-[#121212] px-4 py-8">
      <p class="text-gray-400">Post not found</p>
    </div>
    <div v-else class="bg-[#121212] min-h-[760px]">
      <!-- Content -->
      <div>
        <!-- Image with overlays -->
        <div class="relative">
          <img
            :src="post.coverImage.url"
            :alt="post.title"
            class="w-full h-auto"
            :data-instagram-detail-key="post.id"
          />

          <!-- Back button overlay -->
          <NuxtLink
            to="/profile"
            class="absolute top-2 left-2 p-1.5 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-full transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-white"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Details below image -->
        <div class="p-3">
          <!-- Like section -->
          <div class="flex items-center gap-2.5 mb-2">
            <button class="text-white hover:text-neutral-300 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
            </button>
            <button class="text-white hover:text-neutral-300 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                />
              </svg>
            </button>
            <button class="text-white hover:text-neutral-300 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>

          <p class="text-white font-medium text-xs mb-2">
            {{ post.likes.toLocaleString() }} likes
          </p>

          <!-- Caption -->
          <div class="mb-2">
            <p class="text-white text-xs">
              <span class="font-medium">alexchen</span> {{ post.title }}
            </p>
            <p class="text-neutral-400 text-xs mt-0.5">{{ post.excerpt }}</p>
          </div>

          <!-- Comments -->
          <div class="space-y-1.5 mb-3">
            <p class="text-neutral-400 text-xs">View all {{ post.comments }} comments</p>
            <div class="space-y-1">
              <p class="text-white text-xs">
                <span class="font-medium">user1</span> Amazing!
              </p>
              <p class="text-white text-xs">
                <span class="font-medium">user2</span> Love this!
              </p>
            </div>
          </div>

          <!-- Time -->
          <p class="text-neutral-500 text-xs uppercase">
            {{ post.publishedAt }}
          </p>

          <!-- Comment input -->
          <div class="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              class="flex-1 bg-transparent text-white text-xs outline-none placeholder-neutral-500"
            />
            <button class="text-white text-xs font-medium">Post</button>
          </div>
        </div>
      </div>
    </div>
  </SsgoiTransition>
</template>

<script setup lang="ts">
import { SsgoiTransition } from '@ssgoi/vue';
import { onMounted, onUnmounted } from 'vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const post = useProfilePost(id);

// Add keyboard navigation (ESC to go back)
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    router.push('/profile');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>
