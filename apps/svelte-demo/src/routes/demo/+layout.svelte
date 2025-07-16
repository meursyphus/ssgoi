<script lang="ts">
  import { Ssgoi, type SsgoiConfig } from '@meursyphus/ssgoi-svelte';
  
  const ssgoiConfig: SsgoiConfig = {
    transitions: [],
    defaultTransition: {
      in: async (element) => ({
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        }
      }),
      out: async (element) => ({
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        },
        prepare: (element) => {
          element.style.position = "absolute";
          element.style.width = "100%";
          element.style.top = "0";
          element.style.left = "0";
        }
      })
    }
  };
  
  let { children } = $props();
</script>

<div class="demo-container">
  <nav>
    <a href="/demo">Home</a>
    <a href="/demo/about">About</a>
    <a href="/demo/contact">Contact</a>
  </nav>
  
  <div class="content-wrapper">
    <div class="content-container">
    <Ssgoi config={ssgoiConfig}>
      {@render children()}
    </Ssgoi>
    </div>
  </div>
</div>

<style>
  .demo-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  nav {
    background: #f0f0f0;
    padding: 1rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
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
  
  .content-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem;
  }
  
  .content-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    min-height: 400px;
  }
</style>