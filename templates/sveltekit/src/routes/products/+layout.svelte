<script lang="ts">
  import { Ssgoi } from "@ssgoi/svelte";
  import { slide } from "@ssgoi/svelte/view-transitions";
  import { page } from "$app/stores";
  import SsgoiTransitionBoundary from "$lib/components/ssgoi-transition-boundary.svelte";

  let { children } = $props();

  const categories = [
    { id: "all", label: "All", path: "/products/all" },
    { id: "electronics", label: "Tech", path: "/products/electronics" },
    { id: "fashion", label: "Fashion", path: "/products/fashion" },
    { id: "home", label: "Home", path: "/products/home" },
    { id: "beauty", label: "Beauty", path: "/products/beauty" },
  ];

  const config = {
    transitions: [
      {
        ordered: categories.map((category) => category.path),
        transition: slide(),
      },
    ],
  };
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
      {#each categories as cat}
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
    <Ssgoi {config}>
      <SsgoiTransitionBoundary class="min-h-full bg-[#121212]">
        {@render children()}
      </SsgoiTransitionBoundary>
    </Ssgoi>
  </div>
</div>
