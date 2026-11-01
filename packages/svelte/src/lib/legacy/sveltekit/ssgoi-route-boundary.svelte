<!-- TODO(8.0.0): remove this entry (deprecated in 7.5.0). -->
<!-- @component
@deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/svelte" with
`<Ssgoi framework={...}>` instead.
-->
<script lang="ts">
  import { onNavigate } from "$app/navigation";
  // Stores work throughout SvelteKit 2, including releases before $app/state.
  import { page } from "$app/stores";
  import { setSsgoiFramework } from "../../context.js";
  import SsgoiLayoutBoundary from "../../ssgoi-layout-boundary.svelte";
  import type { SsgoiRouteBoundaryProps } from "./types.js";

  let { resolve, routeKey, ...props }: SsgoiRouteBoundaryProps = $props();

  setSsgoiFramework(() => ({
    getRoute: () => ({ pathname: $page.url.pathname, url: $page.url }),
    onNavigate,
  }));
</script>

<SsgoiLayoutBoundary
  {...props}
  boundary={(route) => {
    const boundary = resolve?.(route) ?? { id: route.pathname };
    return { id: boundary.id, key: routeKey ?? boundary.key ?? boundary.id };
  }}
/>
