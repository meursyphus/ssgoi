<script lang="ts">
  import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/svelte";
  import { page } from "$app/state";
  import { onNavigate } from "$app/navigation";
  import { ssgoiConfig } from "$lib/ssgoi-config";

  let { children } = $props();
</script>

<div class="h-full bg-[#121212] flex z-0">
  <!-- Mobile Frame -->
  <div class="w-full bg-[#121212] flex flex-col overflow-hidden relative">
    <!-- Main Content Area: the one scroll container, outside every boundary -->
    <main
      id="demo-content"
      class="flex-1 w-full overflow-y-scroll overflow-x-hidden relative z-0 bg-[#121212] scrollbar-hide"
    >
      <Ssgoi
        config={ssgoiConfig}
        framework={{
          getRoute: () => ({ pathname: page.url.pathname }),
          onNavigate: (cb) => { console.log("SSGOI-DBG register"); onNavigate((n) => { console.log("SSGOI-DBG nav", n.to?.url.pathname); try { const r = cb(n); console.log("SSGOI-DBG ret", typeof r); return r ? () => { try { r(); console.log("SSGOI-DBG finished"); } catch (e) { console.log("SSGOI-DBG finish err", e.stack); } } : r; } catch (e) { console.log("SSGOI-DBG err", e.stack); } }); },
        }}
      >
        <!-- Depth 0: stays while you move between tabs, moves as a whole
             (bottom nav included) between a tab and a detail page. -->
        <SsgoiLayoutBoundary class="min-h-full flex flex-col bg-[#121212]">
          {@render children()}
        </SsgoiLayoutBoundary>
      </Ssgoi>
    </main>
  </div>
</div>
