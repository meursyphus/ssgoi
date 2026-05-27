<script lang="ts">
  import type { Snippet } from "svelte";
  import { getSsgoiContext } from "./context";

  /**
   * @deprecated Set `data-ssgoi-transition` directly on the page boundary
   * element inside `<Ssgoi>` instead.
   */
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
