<script lang="ts">
  import { page } from "$app/stores";
  import SsgoiTransitionBoundary from "$lib/components/ssgoi-transition-boundary.svelte";
  import { PRODUCT_CATEGORIES } from "$lib/ssgoi-config";

  let { children } = $props();
</script>

<div class="min-h-screen bg-[#121212] flex flex-col">
  <!-- Header - Fixed -->
  <div class="px-4 pt-6 pb-3 shrink-0">
    <h1 class="text-sm font-medium text-white mb-1">Shop</h1>
    <p class="text-xs text-neutral-500">Discover our curated collection</p>
  </div>

  <!-- Category Tabs - Fixed -->
  <div class="px-4 mb-4 shrink-0">
    <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {#each PRODUCT_CATEGORIES as cat}
        <a
          href={cat.path}
          class="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 {$page
            .url.pathname === cat.path
            ? 'bg-white text-black'
            : 'bg-white/10 text-neutral-400 hover:bg-white/15'}"
        >
          {cat.label}
        </a>
      {/each}
    </div>
  </div>

  <!-- Tab Content - Slide transitions here -->
  <div class="flex-1 overflow-hidden relative">
    <SsgoiTransitionBoundary class="min-h-full bg-[#121212]">
      {@render children()}
    </SsgoiTransitionBoundary>
  </div>
</div>
