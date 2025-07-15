<script lang="ts">
  import '../app.css';
  interface Props {
    children: () => any;
  }

  let { children }: Props = $props();
</script>

{@render children()}

<style>
  main {
    position: relative;
  }
  
  nav {
    padding: 1rem;
    display: flex;
    gap: 1rem;
    background: #f0f0f0;
  }
  
  nav a {
    text-decoration: none;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background 0.2s;
  }
  
  nav a:hover {
    background: #e0e0e0;
  }
</style>