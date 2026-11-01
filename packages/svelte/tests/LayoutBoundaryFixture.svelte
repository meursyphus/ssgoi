<script lang="ts">
  import { get } from "svelte/store";
  import {
    Ssgoi,
    SsgoiLayoutBoundary,
    type SsgoiFramework,
    type SsgoiLayoutBoundaryProps,
  } from "../src/lib";
  import { content, onNavigate, page } from "./navigation";
  let {
    boundary,
    getRoute = () => ({ pathname: get(page).url.pathname, url: get(page).url }),
  }: Pick<SsgoiLayoutBoundaryProps, "boundary"> &
    Partial<Pick<SsgoiFramework, "getRoute">> = $props();
</script>

<Ssgoi config={{ transitions: [] }} framework={{ getRoute, onNavigate }}>
  <SsgoiLayoutBoundary {boundary} as="section" class="page" aria-label="Page">
    <input value={$content} />
    <p>{$content}</p>
  </SsgoiLayoutBoundary>
</Ssgoi>
