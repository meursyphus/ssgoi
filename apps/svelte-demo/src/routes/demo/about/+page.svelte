<script lang="ts">
  import { SsgoiTransition } from '@ssgoi/svelte';
</script>

<SsgoiTransition id="/demo/about">
  <div class="page-content">
    <h1>About</h1>
    <p>This is the about page demonstrating SSGOI transitions in Svelte.</p>
    
    <div class="info-section">
      <h2>How it works</h2>
      <p>SSGOI provides smooth transitions between page navigations. When you navigate away from this page, it will fade out while staying in its absolute position, and the new page will fade in smoothly.</p>
    </div>
    
    <div class="info-section">
      <h2>Key Features</h2>
      <ul>
        <li>State-preserving animations</li>
        <li>Spring-based physics</li>
        <li>Smooth interruptions</li>
      </ul>
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
  
  .info-section {
    background: #f0f8ff;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .info-section h2 {
    color: #0066cc;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  
  .info-section p {
    margin-bottom: 0;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    color: #666;
    padding: 0.25rem 0;
    padding-left: 1.5rem;
    position: relative;
  }
  
  li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #0066cc;
  }
</style>