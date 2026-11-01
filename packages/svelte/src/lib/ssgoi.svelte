<script lang="ts">
  import type { Snippet } from "svelte";
  import type { SsgoiConfig } from "@ssgoi/core/types";
  import type { HostAnimation } from "@ssgoi/core/internal";
  import type { SsgoiFramework } from "./types.js";
  import { setSsgoiContext, setSsgoiFramework } from "./context";
  import {
    createSggoiTransitionContext,
    observeSsgoiTransitions,
  } from "@ssgoi/core/internal";
  import { onMount } from "svelte";

  interface Props {
    config: SsgoiConfig;
    host?: HostAnimation;
    /** Router members for `SsgoiLayoutBoundary`. */
    framework?: SsgoiFramework;
    children: Snippet;
  }

  let { config, host, framework, children }: Props = $props();

  const contextValue = createSggoiTransitionContext(config, { host });
  setSsgoiContext(contextValue);
  setSsgoiFramework(() => framework);

  let root: HTMLDivElement;

  onMount(() => observeSsgoiTransitions(root, contextValue));
</script>

<div bind:this={root} data-ssgoi-root="" style="display: contents">
  {@render children()}
</div>
