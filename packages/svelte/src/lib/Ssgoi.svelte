<script lang="ts">
  import { setContext } from 'svelte'
  
  interface Props {
    children?: any
  }
  
  let { children }: Props = $props()
  
  setContext('ssgoi', {})
</script>

{@render children?.()}