<script lang="ts">
  interface Props {
    children?: any
  }
  
  let { children }: Props = $props()
</script>

<div data-ssgoi-page-transition>
  {@render children?.()}
</div>