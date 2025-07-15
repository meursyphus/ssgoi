<script lang="ts">
  import { SsgoiTransition } from '@meursyphus/ssgoi-svelte';
</script>

<SsgoiTransition id="/demo">
  <div class="page-content">
    <h1>Demo Home</h1>
    <p>Welcome to the SSGOI Svelte demo. Navigate between pages to see smooth fade transitions.</p>
    
    <div class="card">
      <h2>Fade Transition Example</h2>
      <p>This demo shows a simple fade transition between pages. The content fades out when leaving and fades in when entering.</p>
    </div>
  </div>
</SsgoiTransition>

<style>
  .page-content {
    padding: 2rem;
  }
  
  h1 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 2rem;
  }
  
  .card h2 {
    color: #444;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .card p {
    margin-bottom: 0;
  }
</style>