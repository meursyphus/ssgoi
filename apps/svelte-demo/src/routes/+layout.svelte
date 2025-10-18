<script lang="ts">
  import "../app.css";
  import { Ssgoi } from "@ssgoi/svelte";
  import { fade, hero, jaemin } from "@ssgoi/svelte/view-transitions";

  interface Props {
    children: () => any;
  }

  let { children }: Props = $props();

  const ssgoiConfig = {
    transitions: [
      // Use hero transition between main and item detail pages
      {
        from: "/",
        to: "/item/*",
        transition: hero({ spring: { stiffness: 5, damping: 1 } }),
        symmetric: true,
      },
      // Hero rotate transition for rotation demo
      {
        from: "/",
        to: "/jaemin",
        transition: jaemin(),
      },
      {
        from: "/jaemin",
        to: "/",
        transition: fade(),
      },
    ],
  };
</script>

<Ssgoi config={ssgoiConfig}>
  <div style="position: relative; min-height: 100vh; width: 100%;">
    {@render children()}
  </div>
</Ssgoi>

<style>
</style>
