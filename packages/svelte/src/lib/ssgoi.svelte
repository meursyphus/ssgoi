<script lang="ts">
  import type { Snippet } from "svelte";
  import type { SsgoiConfig } from "@ssgoi/core/types";
  import type { HostAnimation } from "@ssgoi/core/internal";
  import { setSsgoiContext } from "./context";
  import {
    createSggoiTransitionContext,
    observeSsgoiTransitions,
  } from "@ssgoi/core/internal";
  import { onMount } from "svelte";

  interface Props {
    config: SsgoiConfig;
    host?: HostAnimation;
    children: Snippet;
  }

  let { config, host, children }: Props = $props();

  const contextValue = createSggoiTransitionContext(config, { host });
  setSsgoiContext(contextValue);

  let root: HTMLDivElement;

  onMount(() => observeSsgoiTransitions(root, contextValue));
</script>

<div bind:this={root} data-ssgoi-root="" style="display: contents">
  {@render children()}
</div>
