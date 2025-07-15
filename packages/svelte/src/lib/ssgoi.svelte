<script lang="ts">
  import type { SsgoiConfig } from '@ssgoi/core/types';
  import { setSsgoiContext } from './context';
  import { createSggoiTransitionContext } from '@ssgoi/core';

  interface Props {
    config: SsgoiConfig;
    children: () => any;
  }

  let { config, children }: Props = $props();

  const contextValue = createSggoiTransitionContext(config);
  setSsgoiContext(contextValue);
</script>

{@render children()}