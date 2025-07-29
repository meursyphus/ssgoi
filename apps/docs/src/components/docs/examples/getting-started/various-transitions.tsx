import { CodeTabs } from '../code-tabs';

export function VariousTransitions() {
  return (
    <CodeTabs
      react={`// app/layout.tsx
import { slide, fade, scale } from "@ssgoi/react/view-transitions";

const ssgoiConfig = {
  transitions: [
    // 홈 → 소개: 왼쪽으로 슬라이드
    { from: "/", to: "/about", transition: slide({ direction: "left" }) },
    // 소개 → 홈: 오른쪽으로 슬라이드
    { from: "/about", to: "/", transition: slide({ direction: "right" }) },
    // 목록 → 상세: 확대
    { from: "/list", to: "/detail/*", transition: scale() },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Ssgoi config={ssgoiConfig}>
          <div style={{ position: "relative", minHeight: "100vh" }}>
            {children}
          </div>
        </Ssgoi>
      </body>
    </html>
  );
}`}
      svelte={`<!-- src/routes/+layout.svelte -->
<script>
  import { Ssgoi } from "@ssgoi/svelte";
  import { slide, fade, scale } from "@ssgoi/svelte/view-transitions";

  const ssgoiConfig = {
    transitions: [
      // 홈 → 소개: 왼쪽으로 슬라이드
      { from: "/", to: "/about", transition: slide({ direction: "left" }) },
      // 소개 → 홈: 오른쪽으로 슬라이드
      { from: "/about", to: "/", transition: slide({ direction: "right" }) },
      // 목록 → 상세: 확대
      { from: "/list", to: "/detail/*", transition: scale() },
    ],
  };
</script>

<Ssgoi config={ssgoiConfig}>
  <div style="position: relative; min-height: 100vh;">
    <slot />
  </div>
</Ssgoi>`}
    />
  );
}