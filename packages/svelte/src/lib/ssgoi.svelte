<script lang="ts">
  import type { Snippet } from "svelte";
  import type { SsgoiConfig } from "@ssgoi/core/types";
  import { setSsgoiContext } from "./context";
  import { createSggoiTransitionContext } from "@ssgoi/core/internal";

  interface Props {
    config: SsgoiConfig;
    children: Snippet;
  }

  let { config, children }: Props = $props();

  const contextValue = createSggoiTransitionContext(config);
  setSsgoiContext(contextValue);
</script>

{@render children()}
