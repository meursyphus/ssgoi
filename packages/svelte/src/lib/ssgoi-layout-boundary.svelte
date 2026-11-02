<!-- @component
Route boundary for a layout. Keyed by `config.layouts` at its nesting depth.
-->
<script lang="ts">
  import { flushSync, onDestroy, untrack } from "svelte";
  import { enterSsgoiLayoutBoundary } from "./context.js";
  import type { SsgoiLayoutBoundaryProps } from "./types.js";

  let { children, as = "div", ...rest }: SsgoiLayoutBoundaryProps = $props();

  const { routes, depth } = enterSsgoiLayoutBoundary();

  let current = $state(untrack(() => routes.current(depth)));
  let mounted = $state(true);
  let alive = true;

  onDestroy(() => {
    alive = false;
  });

  routes.onNavigate((boundaryAt) => {
    if (!alive) return;
    const next = boundaryAt(depth);

    if (next.key === current.key) {
      // A persistent shell keeps its DOM, but its outgoing id must stay current.
      return () => {
        if (alive) current = next;
      };
    }

    // Detach before Kit updates its live children snippet, preserving real OUT DOM.
    flushSync(() => {
      mounted = false;
    });

    return () => {
      if (!alive) return;
      flushSync(() => {
        current = next;
        mounted = true;
      });
    };
  });
</script>

{#if mounted}
  <svelte:element this={as} {...rest} data-ssgoi-transition={current.id}>
    {@render children()}
  </svelte:element>
{/if}
