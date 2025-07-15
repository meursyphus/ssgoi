<script lang="ts">
  import '../app.css';
  interface Props {
    children: () => any;
  }

  let { children }: Props = $props();
</script>

{@render children()}

<style>
</style>