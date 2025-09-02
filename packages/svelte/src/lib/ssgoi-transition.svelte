<script lang="ts">
  import { transition } from "./transition";
  import { getSsgoiContext } from "./context";

  interface Props {
    id: string;
    children: () => any;
    as?: keyof HTMLElementTagNameMap;
    class?: string;
  }

  let { id, children, as = "div", class: className }: Props = $props();

  const getTransition = getSsgoiContext();
</script>

<svelte:element
  this={as}
  use:transition={getTransition(id)}
  data-ssgoi-transition={id}
  class={className}
>
  {@render children()}
</svelte:element>
