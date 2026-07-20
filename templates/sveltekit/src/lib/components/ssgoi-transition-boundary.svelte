<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/stores";
  import { flushSync, onDestroy, type Snippet } from "svelte";

  interface Props {
    children: Snippet;
    as?: keyof HTMLElementTagNameMap;
    class?: string;
    getId?: (url: URL) => string;
    [key: string]: unknown;
  }

  const pathnameId = (url: URL) => url.pathname;

  let {
    children,
    as = "div",
    class: className,
    getId = pathnameId,
    ...rest
  }: Props = $props();

  let currentId = $state(getId($page.url));
  let mounted = $state(true);
  let alive = true;

  onDestroy(() => {
    alive = false;
  });

  onNavigate((navigation) => {
    if (!alive || !navigation.to) return;

    const nextId = getId(navigation.to.url);

    if (nextId === currentId) return;

    // Detach the old route before SvelteKit updates its live `children`
    // snippet. SSGOI can then retain the real outgoing DOM for its animation.
    flushSync(() => {
      mounted = false;
    });

    // SvelteKit calls this after the route DOM has updated. Rendering the
    // snippet now produces only the incoming route under its own boundary.
    return () => {
      if (!alive) return;

      flushSync(() => {
        currentId = nextId;
        mounted = true;
      });
    };
  });
</script>

{#if mounted}
  <svelte:element
    this={as}
    data-ssgoi-transition={currentId}
    class={className}
    {...rest}
  >
    {@render children()}
  </svelte:element>
{/if}
