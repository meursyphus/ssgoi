<script>import defaultAttributes from './defaultAttributes';
export let name = undefined;
export let color = 'currentColor';
export let size = 24;
export let strokeWidth = 2;
export let absoluteStrokeWidth = false;
export let iconNode = [];
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && array.indexOf(className) === index;
})
    .join(' ');
</script>

<svg
  {...defaultAttributes}
  {...$$restProps}
  width={size}
  height={size}
  stroke={color}
  stroke-width={
    absoluteStrokeWidth
      ? Number(strokeWidth) * 24 / Number(size)
      : strokeWidth
  }
  class={
    mergeClasses(
      'lucide-icon',
      'lucide',
      name ? `lucide-${name}`: '',
      $$props.class
    )
  }
>
  {#each iconNode as [tag, attrs]}
    <svelte:element this={tag} {...attrs}/>
  {/each}
  <slot />
</svg>
