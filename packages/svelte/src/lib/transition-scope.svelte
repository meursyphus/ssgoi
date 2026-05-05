<script lang="ts">
  import type { Snippet } from "svelte";
  import { createTransitionScope } from "@ssgoi/core/internal";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<!--
  TransitionScope creates a boundary for local-scoped transitions.

  Child elements with `scope: 'local'` will:
  - Skip IN animation when mounted simultaneously with the scope
  - Skip OUT animation when unmounted simultaneously with the scope

  @example
  ```svelte
  <TransitionScope>
    <div use:transition={[fadeIn(), { scope: 'local' }]}>
      This will only animate when added/removed independently,
      not when the entire scope mounts/unmounts.
    </div>
  </TransitionScope>
  ```
-->
<div use:createTransitionScope style="display: contents;">
  {@render children()}
</div>
