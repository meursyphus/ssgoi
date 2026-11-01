<script lang="ts">
  import { SsgoiLayoutBoundary } from "@ssgoi/svelte";

  let { children } = $props();
</script>

<!-- Depth 1: one detail page replaces another. -->
<SsgoiLayoutBoundary class="flex-1 bg-[#121212]">
  {@render children()}
</SsgoiLayoutBoundary>
