<script lang="ts">
  import { SsgoiTransition } from "@ssgoi/svelte";
</script>

<SsgoiTransition id="/jaemin">
  <div
    style="
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    "
  >
    <h1
      style="
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 2rem;
        text-align: center;
      "
    >
      Jaemin Transition
    </h1>

    <p
      style="
        font-size: 1.2rem;
        margin-bottom: 3rem;
        text-align: center;
        max-width: 600px;
        line-height: 1.6;
      "
    >
      This page demonstrates the jaemin transition effect. The transition shows:
    </p>

    <div
      style="
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 12px;
        margin-bottom: 3rem;
        backdrop-filter: blur(10px);
      "
    >
      <ul
        style="
          list-style: none;
          padding: 0;
          margin: 0;
        "
      >
        <li style="margin-bottom: 1rem;">✨ Previous page fades out</li>
        <li style="margin-bottom: 1rem;">
          🎯 This page appears rotated 45° and scaled down
        </li>
        <li style="margin-bottom: 1rem;">📈 Gradually scales up to 2/3 size</li>
        <li style="margin-bottom: 1rem;">
          🔄 Rotates back to 0° while filling screen
        </li>
      </ul>
    </div>

    <a
      href="/"
      style="
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        text-decoration: none;
        border: 2px solid rgba(255, 255, 255, 0.3);
        transition: all 0.2s ease;
        font-size: 1.1rem;
        font-weight: 600;
      "
      onmouseenter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onmouseleave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      ← Back to Home
    </a>
  </div>
</SsgoiTransition>
