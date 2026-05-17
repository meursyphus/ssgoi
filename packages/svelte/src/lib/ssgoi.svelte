<script lang="ts">
  import type { Snippet } from "svelte";
  import type { SsgoiConfig } from "@ssgoi/core/types";
  import type { HostAnimation } from "@ssgoi/core/internal";
  import { setSsgoiContext } from "./context";
  import { createSggoiTransitionContext } from "@ssgoi/core/internal";

  interface Props {
    config: SsgoiConfig;
    host?: HostAnimation;
    children: Snippet;
  }

  let { config, host, children }: Props = $props();

  const contextValue = createSggoiTransitionContext(config, { host });
  setSsgoiContext(contextValue);
</script>

{@render children()}
