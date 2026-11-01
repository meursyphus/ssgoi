<script lang="ts">
  import { SsgoiLayoutBoundary } from "@ssgoi/svelte";
  import BottomNav from "$lib/components/bottom-nav.svelte";

  let { children } = $props();
</script>

<div class="flex-1 flex flex-col">
  <!-- Depth 1: only the tab content moves between tabs. -->
  <SsgoiLayoutBoundary class="flex-1 flex flex-col bg-[#121212]">
    {@render children()}
  </SsgoiLayoutBoundary>

  <!-- Outside the depth-1 boundary, inside the depth-0 one. -->
  <BottomNav />
</div>
