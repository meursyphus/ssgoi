<script lang="ts">
  import { SsgoiTransition, transition, TransitionScope } from "@ssgoi/svelte";

  let showShapes = $state(true);
  let stiffness = $state(300);
  let damping = $state(30);

  // TransitionScope demo states
  let showScopeContainer = $state(true);
  let showLocalChild = $state(true);
  let showGlobalChild = $state(true);

  const colors = [
    { id: 1, color: "#FF6B6B", name: "Coral" },
    { id: 2, color: "#4ECDC4", name: "Turquoise" },
    { id: 3, color: "#45B7D1", name: "Sky Blue" },
    { id: 4, color: "#96CEB4", name: "Sage" },
    { id: 5, color: "#FECA57", name: "Sunflower" },
    { id: 6, color: "#DDA0DD", name: "Plum" },
  ];
</script>

<SsgoiTransition id="/">
  <div class="app-container">
    <div class="hero-section">
      <h1 class="app-title">SSGOI Svelte Demo</h1>
    </div>

    <!-- Hero Transition Section -->
    <div class="hero-transition-section">
      <h2 class="section-title">Hero Transition</h2>
      <div class="color-grid">
        {#each colors as item}
          <a
            href={`/item/${item.id}`}
            class="color-box"
            style="background-color: {item.color}"
            data-hero-key={`color-${item.id}`}
          >
            <span class="color-name">{item.name}</span>
          </a>
        {/each}
      </div>

      <!-- Jaemin Demo -->
      <div style="margin-top: 2rem;">
        <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #333;">
          Jaemin Transition
        </h3>
        <a
          href="/jaemin"
          style="
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: transform 0.2s ease;
          "
          onmouseenter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onmouseleave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          🎯 Demo Tunnel Emergence Animation
        </a>
      </div>
    </div>

    <!-- DOM Transition Section -->
    <div class="controls-section">
      <div class="controls">
        <div class="speed-buttons">
          <button
            class="speed-button {stiffness === 100 ? 'active' : ''}"
            onclick={() => {
              stiffness = 100;
              damping = 20;
            }}
          >
            Smooth
          </button>
          <button
            class="speed-button {stiffness === 300 ? 'active' : ''}"
            onclick={() => {
              stiffness = 300;
              damping = 30;
            }}
          >
            Normal
          </button>
          <button
            class="speed-button {stiffness === 500 ? 'active' : ''}"
            onclick={() => {
              stiffness = 500;
              damping = 40;
            }}
          >
            Fast
          </button>
        </div>

        <div class="control-group">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="control-label">Stiffness</label>
          <input
            type="number"
            class="control-input"
            bind:value={stiffness}
            min="1"
            max="1000"
          />
          <span class="control-value">(1-1000)</span>
        </div>

        <div class="control-group">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="control-label">Damping</label>
          <input
            type="number"
            class="control-input"
            bind:value={damping}
            min="0"
            max="100"
          />
          <span class="control-value">(0-100)</span>
        </div>
      </div>
    </div>

    <div class="toggle-section">
      <button onclick={() => (showShapes = !showShapes)} class="toggle-button">
        {showShapes ? "Hide Elements" : "Show Elements"}
      </button>
    </div>

    <div class="examples-section">
      <h2 class="section-title">DOM Transition</h2>
      <div class="shapes-grid">
        <div class="shape-container">
          <div class="shape-wrapper">
            {#if showShapes}
              <div
                use:transition={{
                  in: (element) => ({
                    spring: { stiffness, damping },
                    tick: (progress) => {
                      element.style.opacity = progress.toString();
                    },
                  }),
                  out: (element) => ({
                    spring: { stiffness, damping },
                    tick: (progress) => {
                      element.style.opacity = progress.toString();
                    },
                  }),
                }}
                class="shape circle"
              ></div>
            {/if}
          </div>
          <p class="shape-label">Fade</p>
        </div>

        <div class="shape-container">
          <div class="shape-wrapper">
            {#if showShapes}
              <div
                use:transition={{
                  in: (element) => ({
                    spring: { stiffness, damping },
                    tick: (progress) => {
                      element.style.transform = `scale(${progress}) rotate(${progress * 360}deg)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                  out: (element) => ({
                    spring: { stiffness, damping },
                    tick: (progress) => {
                      element.style.transform = `scale(${progress}) rotate(${progress * 360}deg)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                }}
                class="shape triangle"
              ></div>
            {/if}
          </div>
          <p class="shape-label">Scale + Rotate</p>
        </div>

        <div class="shape-container">
          <div class="shape-wrapper">
            {#if showShapes}
              <div
                use:transition={{
                  in: (element) => ({
                    spring: { stiffness, damping },
                    tick: (progress) => {
                      element.style.transform = `translateX(${
                        (1 - progress) * -100
                      }px)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                  out: (element) => ({
                    spring: { stiffness, damping },
                    tick: (progress) => {
                      element.style.transform = `translateX(${
                        (1 - progress) * -100
                      }px)`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                }}
                class="shape square"
              ></div>
            {/if}
          </div>
          <p class="shape-label">Slide In</p>
        </div>

        <div class="shape-container">
          <div class="shape-wrapper">
            {#if showShapes}
              <div
                use:transition={{
                  in: (element) => ({
                    spring: {
                      stiffness: stiffness * 0.8,
                      damping: damping * 0.7,
                    },
                    tick: (progress) => {
                      const scale = 0.5 + progress * 0.5;
                      element.style.transform = `scale(${scale})`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                  out: (element) => ({
                    spring: { stiffness, damping },
                    tick: (progress) => {
                      const scale = 0.5 + progress * 0.5;
                      element.style.transform = `scale(${scale})`;
                      element.style.opacity = progress.toString();
                    },
                  }),
                }}
                class="shape pentagon"
              ></div>
            {/if}
          </div>
          <p class="shape-label">Bounce Scale</p>
        </div>
      </div>
    </div>

    <!-- TransitionScope Demo Section -->
    <div class="examples-section">
      <h2 class="section-title">TransitionScope Demo</h2>
      <p
        style="color: #666; margin-bottom: 1.5rem; line-height: 1.6; text-align: center;"
      >
        <strong>Local scope:</strong> Skip animation when mounting/unmounting
        with parent scope.
        <br />
        <strong>Global scope (default):</strong> Always run animation.
      </p>

      <div
        style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; flex-wrap: wrap;"
      >
        <button
          class="toggle-button"
          onclick={() => (showScopeContainer = !showScopeContainer)}
        >
          {showScopeContainer ? "Hide Scope Container" : "Show Scope Container"}
        </button>
        <button
          class="toggle-button"
          onclick={() => (showLocalChild = !showLocalChild)}
          disabled={!showScopeContainer}
          style={!showScopeContainer
            ? "opacity: 0.5; cursor: not-allowed;"
            : ""}
        >
          {showLocalChild ? "Hide Local Child" : "Show Local Child"}
        </button>
        <button
          class="toggle-button"
          onclick={() => (showGlobalChild = !showGlobalChild)}
          disabled={!showScopeContainer}
          style={!showScopeContainer
            ? "opacity: 0.5; cursor: not-allowed;"
            : ""}
        >
          {showGlobalChild ? "Hide Global Child" : "Show Global Child"}
        </button>
      </div>

      <div
        style="display: flex; gap: 2rem; justify-content: center; min-height: 200px; align-items: center;"
      >
        {#if showScopeContainer}
          <TransitionScope>
            <div
              style="padding: 2rem; border: 2px dashed #ccc; border-radius: 12px; display: flex; gap: 1.5rem; background: #fafafa;"
            >
              <div style="text-align: center;">
                <p
                  style="margin-bottom: 0.5rem; font-weight: 600; color: #333;"
                >
                  Local Scope
                </p>
                {#if showLocalChild}
                  <div
                    use:transition={{
                      scope: "local",
                      in: (element) => ({
                        spring: { stiffness: 300, damping: 25 },
                        css: (progress) => ({
                          opacity: progress,
                          transform: `scale(${0.5 + progress * 0.5})`,
                        }),
                      }),
                      out: (element) => ({
                        spring: { stiffness: 300, damping: 25 },
                        css: (progress) => ({
                          opacity: progress,
                          transform: `scale(${0.5 + progress * 0.5})`,
                        }),
                      }),
                    }}
                    style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;"
                  ></div>
                {/if}
                <p style="font-size: 0.75rem; color: #888; margin-top: 0.5rem;">
                  Skips when scope unmounts
                </p>
              </div>

              <div style="text-align: center;">
                <p
                  style="margin-bottom: 0.5rem; font-weight: 600; color: #333;"
                >
                  Global Scope
                </p>
                {#if showGlobalChild}
                  <div
                    use:transition={{
                      in: (element) => ({
                        spring: { stiffness: 300, damping: 25 },
                        css: (progress) => ({
                          opacity: progress,
                          transform: `scale(${0.5 + progress * 0.5})`,
                        }),
                      }),
                      out: (element) => ({
                        spring: { stiffness: 300, damping: 25 },
                        css: (progress) => ({
                          opacity: progress,
                          transform: `scale(${0.5 + progress * 0.5})`,
                        }),
                      }),
                    }}
                    style="width: 80px; height: 80px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px;"
                  ></div>
                {/if}
                <p style="font-size: 0.75rem; color: #888; margin-top: 0.5rem;">
                  Always animates
                </p>
              </div>
            </div>
          </TransitionScope>
        {/if}
      </div>

      <div
        style="margin-top: 1.5rem; padding: 1rem; background: #f0f0f0; border-radius: 8px; font-size: 0.9rem; color: #555;"
      >
        <strong>Test scenarios:</strong>
        <ul style="margin: 0.5rem 0 0 1.5rem; line-height: 1.8;">
          <li>
            <strong>Toggle individual children:</strong> Both should animate (scope
            is stable)
          </li>
          <li>
            <strong>Toggle Scope Container:</strong> Local child should NOT animate,
            Global child should animate
          </li>
        </ul>
      </div>
    </div>
  </div>
</SsgoiTransition>

<style>
  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 3rem;
  }

  .app-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0;
    letter-spacing: -0.02em;
    color: #333;
  }

  /* Controls Section */
  .controls-section {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    margin-bottom: 3rem;
  }

  .controls {
    display: flex;
    gap: 3rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .speed-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .speed-button {
    padding: 0.625rem 1.25rem;
    border: 2px solid #e1e4e8;
    border-radius: 8px;
    background-color: white;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
    color: #333;
  }

  .speed-button:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-1px);
  }

  .speed-button.active {
    background-color: #667eea;
    border-color: #667eea;
    color: white;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .control-label {
    font-size: 0.875rem;
    color: #666;
    font-weight: 500;
  }

  .control-input {
    width: 80px;
    padding: 0.375rem 0.75rem;
    border: 2px solid #e1e4e8;
    border-radius: 6px;
    text-align: center;
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }

  .control-input:focus {
    outline: none;
    border-color: #667eea;
  }

  .control-value {
    font-size: 0.75rem;
    color: #999;
  }

  /* Toggle Button */
  .toggle-section {
    text-align: center;
    margin-bottom: 4rem;
  }

  .toggle-button {
    padding: 0.875rem 2.5rem;
    font-size: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .toggle-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  /* Transition Examples Section */
  .examples-section {
    margin-bottom: 5rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-align: center;
    color: #333;
  }

  .shapes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    padding: 2rem;
  }

  .shape-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
  }

  .shape-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .shape-wrapper {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .shape {
    width: 80px;
    height: 80px;
    position: relative;
  }

  .circle {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
  }

  .triangle {
    width: 0;
    height: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-bottom: 70px solid #4ecdc4;
  }

  .square {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    border-radius: 8px;
  }

  .pentagon {
    position: relative;
    width: 80px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    height: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-top: 30px solid;
    border-image: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) 1;
  }

  .pentagon::before {
    content: "";
    position: absolute;
    top: -70px;
    left: -40px;
    width: 0;
    height: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-bottom: 40px solid #f093fb;
  }

  .shape-label {
    font-size: 1rem;
    font-weight: 500;
    color: #666;
    margin: 0;
  }

  /* Hero Transition Section */
  .hero-transition-section {
    background: white;
    border-radius: 16px;
    padding: 3rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    margin-bottom: 3rem;
  }

  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .color-box {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    cursor: pointer;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s;
  }

  .color-box:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .color-name {
    color: white;
    font-size: 1.125rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    .app-title {
      font-size: 2.5rem;
    }

    .shapes-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
  }
</style>
