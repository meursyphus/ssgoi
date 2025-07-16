<script lang="ts">
  import { transition } from './transition';
  import { getSsgoiContext } from './context';

  interface Props {
    id: string;
    children: () => any;
  }

  let { id, children }: Props = $props();

  const getTransition = getSsgoiContext();
</script>

<div use:transition={getTransition(id)} data-ssgoi-transition={id}>
  {@render children()}
</div>