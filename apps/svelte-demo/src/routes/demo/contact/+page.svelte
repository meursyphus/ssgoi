<script lang="ts">
  import { SsgoiTransition } from '@ssgoi/svelte';
</script>

<SsgoiTransition id="/demo/contact">
  <div class="page-content">
    <h1>Contact</h1>
    <p>Get in touch with us about SSGOI.</p>
    
    <div class="contact-card">
      <h2>GitHub</h2>
      <p>Visit our GitHub repository for issues, contributions, and discussions.</p>
      <a href="https://github.com/meursyphus/ssgoi" target="_blank" rel="noopener noreferrer">
        github.com/meursyphus/ssgoi
      </a>
    </div>
    
    <div class="contact-card">
      <h2>Documentation</h2>
      <p>Check out our documentation for detailed usage instructions and API reference.</p>
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
  
  .contact-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: box-shadow 0.2s;
  }
  
  .contact-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .contact-card h2 {
    color: #333;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  
  .contact-card p {
    margin-bottom: 1rem;
  }
  
  a {
    color: #0066cc;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
</style>