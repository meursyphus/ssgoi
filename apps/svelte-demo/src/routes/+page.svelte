<script lang="ts">
  import { transition } from '@meursyphus/ssgoi-svelte';
  
  let showShapes = $state(true);
  let stiffness = $state(1000);
  let damping = $state(100);
  let count = $state(0);
</script>

<div class="app-container">
  <h1 class="app-title">use:transition Examples</h1>
  
  <div class="demo-link">
    <a href="/demo">View Page Transition Demo →</a>
  </div>
  
  <div class="controls">
    <div class="speed-buttons">
      <button
        class="speed-button slow"
        onclick={() => {
          stiffness = 200;
          damping = 100;
        }}
      >
        느리게
      </button>
      <button
        class="speed-button fast"
        onclick={() => {
          stiffness = 1000;
          damping = 100;
        }}
      >
        빠르게
      </button>
    </div>
    
    <div class="control-group">
      <label class="control-label" for="stiffness">Stiffness</label>
      <input
        id="stiffness"
        type="number"
        class="control-input"
        bind:value={stiffness}
        min="1"
        max="1000"
      />
      <span class="control-value">(1-1000)</span>
    </div>
    
    <div class="control-group">
      <label class="control-label" for="damping">Damping</label>
      <input
        id="damping"
        type="number"
        class="control-input"
        bind:value={damping}
        min="0"
        max="100"
      />
      <span class="control-value">(0-100)</span>
    </div>
  </div>
  
  <div class="button-group">
    <button
      onclick={() => showShapes = !showShapes}
      class="toggle-button"
    >
      {showShapes ? "Hide All Shapes" : "Show All Shapes"}
    </button>
    <button
      onclick={() => count = count + 1}
      class="count-button"
    >
      Count Up
    </button>
    <span class="count-display">Count: {count}</span>
  </div>
  
  <div class="shapes-grid">
    <!-- Fade transition -->
    <div class="shape-container">
      <div class="shape-wrapper">
        {#if showShapes}
          <div
            use:transition={{
              key: 'fade',
              in: (element) => ({
                spring: { stiffness, damping },
                tick: (progress) => {
                  element.style.opacity = progress.toString();
                }
              }),
              out: (element) => ({
                spring: { stiffness, damping },
                tick: (progress) => {
                  element.style.opacity = progress.toString();
                }
              })
            }}
            class="shape circle"
          ></div>
        {/if}
      </div>
      <p class="shape-label">Fade</p>
    </div>
    
    <!-- Scale + Rotate transition -->
    <div class="shape-container">
      <div class="shape-wrapper">
        {#if showShapes}
          <div
            use:transition={{
              key: 'scale-rotate',
              in: (element) => ({
                spring: { stiffness, damping },
                tick: (progress) => {
                  element.style.transform = `scale(${progress}) rotate(${progress * 360}deg)`;
                  element.style.opacity = progress.toString();
                }
              }),
              out: (element) => ({
                spring: { stiffness, damping },
                tick: (progress) => {
                  element.style.transform = `scale(${progress}) rotate(${progress * 360}deg)`;
                  element.style.opacity = progress.toString();
                }
              })
            }}
            class="shape triangle"
          ></div>
        {/if}
      </div>
      <p class="shape-label">Scale + Rotate</p>
    </div>
    
    <!-- Slide transition -->
    <div class="shape-container">
      <div class="shape-wrapper">
        {#if showShapes}
          <div
            use:transition={{
              key: 'slide',
              in: (element) => ({
                spring: { stiffness, damping },
                tick: (progress) => {
                  element.style.transform = `translateX(${(1 - progress) * -100}px)`;
                  element.style.opacity = progress.toString();
                }
              }),
              out: (element) => ({
                spring: { stiffness, damping },
                tick: (progress) => {
                  element.style.transform = `translateX(${(1 - progress) * -100}px)`;
                  element.style.opacity = progress.toString();
                }
              })
            }}
            class="shape square"
          ></div>
        {/if}
      </div>
      <p class="shape-label">Slide</p>
    </div>
    
    <!-- Scale + Fade transition -->
    <div class="shape-container">
      <div class="shape-wrapper">
        {#if showShapes}
          <div
            use:transition={{
              key: 'scale-fade',
              in: (element) => ({
                spring: { stiffness, damping },
                tick: (progress) => {
                  const scale = 0.5 + progress * 0.5;
                  element.style.transform = `scale(${scale})`;
                  element.style.opacity = progress.toString();
                }
              }),
              out: (element) => ({
                spring: { stiffness, damping },
                tick: (progress) => {
                  const scale = 0.5 + progress * 0.5;
                  element.style.transform = `scale(${scale})`;
                  element.style.opacity = progress.toString();
                }
              })
            }}
            class="shape pentagon"
          ></div>
        {/if}
      </div>
      <p class="shape-label">Scale + Fade</p>
    </div>
  </div>
</div>

<style>
  .app-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .app-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #333;
  }
  
  .toggle-button {
    display: block;
    margin: 0 auto 3rem;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .toggle-button:hover {
    background-color: #0056b3;
  }
  
  .shapes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 3rem;
    padding: 2rem;
  }
  
  .shape-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .shape-wrapper {
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .shape {
    width: 100px;
    height: 100px;
    position: relative;
  }
  
  .circle {
    background-color: #ff6b6b;
    border-radius: 50%;
  }
  
  .triangle {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 87px solid #4ecdc4;
  }
  
  .square {
    background-color: #45b7d1;
  }
  
  .pentagon {
    position: relative;
    width: 100px;
    background-color: #ffd93d;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 38px solid #ffd93d;
  }
  
  .pentagon::before {
    content: '';
    position: absolute;
    top: -88px;
    left: -50px;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 50px solid #ffd93d;
  }
  
  .shape-label {
    font-size: 1.1rem;
    font-weight: 500;
    color: #555;
    margin: 0;
  }
  
  .controls {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .speed-buttons {
    display: flex;
    gap: 0.5rem;
    margin-right: 1rem;
  }
  
  .speed-button {
    padding: 0.5rem 1rem;
    border: 2px solid #ddd;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .speed-button:hover {
    border-color: #007bff;
    background-color: #f8f9fa;
  }
  
  .speed-button.slow {
    color: #dc3545;
  }
  
  
  .speed-button.fast {
    color: #28a745;
  }
  
  .speed-button:active {
    transform: translateY(1px);
  }
  
  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  
  .control-label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }
  
  .control-input {
    width: 80px;
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    font-size: 1rem;
  }
  
  .control-value {
    font-size: 0.8rem;
    color: #888;
  }
  
  .count-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 1rem;
  }
  
  .count-button:hover {
    background-color: #218838;
  }
  
  .button-group {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
  }
  
  .count-display {
    font-size: 1.2rem;
    color: #333;
    font-weight: 600;
    margin: 0 1rem;
  }
  
  .demo-link {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .demo-link a {
    color: #0066cc;
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: 500;
    transition: color 0.2s;
  }
  
  .demo-link a:hover {
    color: #0052a3;
    text-decoration: underline;
  }
</style>
