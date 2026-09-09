<script lang="ts">
  import { onNavigate } from "$app/navigation";
  // Stores work throughout SvelteKit 2, including releases before $app/state.
  import { page } from "$app/stores";
  import { flushSync, onDestroy, untrack } from "svelte";
  import type { SsgoiRouteBoundaryProps } from "./types.js";

  let {
    children,
    as = "div",
    routeKey,
    resolve,
    ...rest
  }: SsgoiRouteBoundaryProps = $props();

  const getBoundary = (url: URL) => {
    const boundary = resolve?.({ pathname: url.pathname, url }) ?? {
      id: url.pathname,
    };
    return { id: boundary.id, key: routeKey ?? boundary.key ?? boundary.id };
  };

  let current = $state(untrack(() => getBoundary($page.url)));
  let mounted = $state(true);
  let alive = true;

  onDestroy(() => {
    alive = false;
  });

  onNavigate((navigation) => {
    if (!alive || !navigation.to) return;
    const next = getBoundary(navigation.to.url);

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
