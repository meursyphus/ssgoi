<script lang="ts">
  import { SsgoiTransition } from '@ssgoi/svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const colors = [
    { id: 1, color: '#FF6B6B', name: 'Coral' },
    { id: 2, color: '#4ECDC4', name: 'Turquoise' },
    { id: 3, color: '#45B7D1', name: 'Sky Blue' },
    { id: 4, color: '#96CEB4', name: 'Sage' },
    { id: 5, color: '#FECA57', name: 'Sunflower' },
    { id: 6, color: '#DDA0DD', name: 'Plum' },
  ];

  $: id = Number($page.params.id);
  $: item = colors.find((c) => c.id === id);
</script>

{#if item}
  <SsgoiTransition id={`/item/${id}`}>
    <div
      class="detail-container"
      style="background-color: {item.color}"
      data-hero-key={`color-${item.id}`}
    >
      <button onclick={() => goto('/')} class="back-button">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back
      </button>

      <div class="content">
        <div
          class="color-display"
          style="background-color: {item.color}"
        />
        <h1 class="color-title">{item.name}</h1>
        <p class="color-value">{item.color}</p>

        <div class="color-info">
          <div class="info-card">
            <div class="info-label">RGB</div>
            <div class="info-value">
              {parseInt(item.color.slice(1, 3), 16)},{parseInt(item.color.slice(3, 5), 16)},{parseInt(item.color.slice(5, 7), 16)}
            </div>
          </div>
          <div class="info-card">
            <div class="info-label">HSL</div>
            <div class="info-value">Coming soon</div>
          </div>
        </div>
      </div>
    </div>
  </SsgoiTransition>
{:else}
  <div>Item not found</div>
{/if}

<style>
  .detail-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .back-button {
    position: absolute;
    top: 2rem;
    left: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 10px;
    color: #333;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    font-family: inherit;
  }

  .back-button:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateX(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .content {
    text-align: center;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .color-display {
    display: none;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  .color-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    letter-spacing: -0.02em;
  }

  .color-value {
    font-size: 1.5rem;
    opacity: 0.9;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    display: inline-block;
  }

  .color-info {
    margin-top: 2rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .info-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1.5rem 2rem;
    border-radius: 12px;
    min-width: 150px;
  }

  .info-label {
    font-size: 0.875rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }

  .info-value {
    font-size: 1.25rem;
    font-weight: 600;
  }
</style>