<!-- TODO(8.0.0): remove this entry (deprecated in 7.5.0). -->
<!-- @component
@deprecated Will be removed in 8.0.0.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { getSsgoiContext } from "../context";

  /** @deprecated Will be removed in 8.0.0. */
  interface Props {
    id: string;
    children: Snippet;
    as?: keyof HTMLElementTagNameMap;
    class?: string;
    [key: string]: unknown;
  }

  let { id, children, as = "div", class: className, ...rest }: Props = $props();

  const ssgoi = getSsgoiContext();

  function ssgoiRef(node: HTMLElement) {
    ssgoi.refFor(id)(node);
  }
</script>

<svelte:element
  this={as}
  use:ssgoiRef
  data-ssgoi-transition={id}
  class={className}
  {...rest}
>
  {@render children()}
</svelte:element>
