<script lang="ts">
  import {
    SsgoiRouteBoundary,
    type SsgoiRouteBoundaryProps,
  } from "../src/lib/sveltekit";
  import { content } from "./navigation";
  let {
    resolve,
    routeKey,
  }: Pick<SsgoiRouteBoundaryProps, "resolve" | "routeKey"> = $props();
</script>

<SsgoiRouteBoundary
  {resolve}
  {routeKey}
  as="section"
  class="page"
  aria-label="Page"
>
  <input value={$content} />
  <p>{$content}</p>
</SsgoiRouteBoundary>
