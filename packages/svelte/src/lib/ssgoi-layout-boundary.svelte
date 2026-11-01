<!-- @component
Route boundary for a layout. Reads the router through `<Ssgoi framework>`.
-->
<script lang="ts">
  import { flushSync, onDestroy, untrack } from "svelte";
  import { getSsgoiFramework } from "./context.js";
  import type { SsgoiLayoutBoundaryProps } from "./types.js";

  let {
    children,
    as = "div",
    boundary: input,
    ...rest
  }: SsgoiLayoutBoundaryProps = $props();

  const framework = getSsgoiFramework();
  const resolver = untrack(() =>
    typeof input === "function" ? input : () => input,
  );

  const getBoundary = (route: { pathname: string; url: URL }) => {
    const result = resolver(route);
    const normalized =
      typeof result === "string" ? { key: result } : (result ?? {});
    const id = normalized.id ?? route.pathname;
    return { id, key: normalized.key ?? id };
  };

  let current = $state(untrack(() => getBoundary(framework.getRoute())));
  let mounted = $state(true);
  let alive = true;

  onDestroy(() => {
    alive = false;
  });

  framework.onNavigate((navigation) => {
    if (!alive || !navigation.to) return;
    const { url } = navigation.to;
    const next = getBoundary({ pathname: url.pathname, url });

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
