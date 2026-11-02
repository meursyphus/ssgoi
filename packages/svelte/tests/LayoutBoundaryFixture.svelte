<script lang="ts">
  import { get } from "svelte/store";
  import { Ssgoi, SsgoiLayoutBoundary, type SsgoiConfig } from "../src/lib";
  import { content, onNavigate, page } from "./navigation";
  let {
    layouts,
    nested = false,
  }: { layouts?: SsgoiConfig["layouts"]; nested?: boolean } = $props();
</script>

<Ssgoi
  config={{ transitions: [], layouts }}
  framework={{
    getRoute: () => ({ pathname: get(page).url.pathname }),
    onNavigate,
  }}
>
  <SsgoiLayoutBoundary as="section" class="page" aria-label="Page">
    {#if nested}
      <SsgoiLayoutBoundary as="article">
        <input value={$content} />
        <p>{$content}</p>
      </SsgoiLayoutBoundary>
    {:else}
      <input value={$content} />
      <p>{$content}</p>
    {/if}
  </SsgoiLayoutBoundary>
</Ssgoi>
