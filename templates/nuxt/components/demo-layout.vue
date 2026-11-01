<template>
  <div class="h-full bg-[#121212] flex z-0">
    <!-- Mobile Frame -->
    <div class="w-full bg-[#121212] flex flex-col overflow-hidden relative">
      <!-- Main Content Area: the one scroll container, outside every boundary -->
      <main
        id="demo-content"
        class="flex-1 w-full overflow-y-scroll overflow-x-hidden relative z-0 bg-[#121212] scrollbar-hide"
      >
        <Ssgoi :config="ssgoiConfig" :framework="framework">
          <!-- Depth 0: stays while you move between tabs, moves as a whole
               (bottom nav included) between a tab and a detail page. -->
          <SsgoiLayoutBoundary class="min-h-full flex flex-col bg-[#121212]">
            <slot />
          </SsgoiLayoutBoundary>
        </Ssgoi>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/vue";
import { ssgoiConfig } from "~/utils/ssgoi-config";

const router = useRouter();
const framework = {
  getRoute: () => ({ pathname: router.currentRoute.value.path }),
};
</script>
